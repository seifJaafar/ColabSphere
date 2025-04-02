const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const redisClient = require("../config/redisClient"); // No need for .js in CommonJS
const db = require("../models/index");

const { sendEmail, ResetPassword } = require("../config/mailing");
const { User } = db;
dotenv.config();

// **Token Generation**
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};
const generateRandomPassword = () => {
  const randomString = crypto.randomBytes(8).toString("hex");
  return randomString;
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// **Register Controller**
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      email,
      password,
      username,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error in registering user Please verify your Data" });
  }
};

// **Login Controller**
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
    await redisClient.set(user.id.toString(), refreshToken);
    res.json({ accessToken, refreshToken, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
};

// **Refresh Token Controller**
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          console.log("here error");
          return res.status(403).json({ message: "Invalid refresh token " });
        }

        const storedToken = await redisClient.get(user.id.toString());
        if (storedToken !== refreshToken) {
          console.log("here error2");
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await redisClient.set(user.id.toString(), newRefreshToken);

        res.json({
          accessToken: newAccessToken,
          newRefreshToken: newRefreshToken,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Refresh token error" });
  }
};

// **Logout Controller**
const logout = async (req, res) => {
  try {
    const user = req.user;
    await redisClient.del(user.id.toString());
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout error" });
  }
};
const GoogleCallback = async (req, res) => {
  try {
    const { id, email, displayName, GoogleaccessToken, GooglerefreshToken } =
      req.user;

    // Check if the user exists in the database
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user with random password
      user = await User.create({
        email,
        username: displayName,
        password: generateRandomPassword(),
        googleRefreshToken: GooglerefreshToken,
        googleAccessToken: GoogleaccessToken,
      });
    } else {
      user.googleAccessToken = GoogleaccessToken;
      user.googleRefreshToken = GooglerefreshToken;
      await user.save();
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token (if needed)
    await redisClient.set(user.id.toString(), refreshToken);
    const redirectUrl = `${process.env.CLIENT_URL}/confirm?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&username=${displayName}&avatar=${user.avatar}&id=${user.id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google OAuth login error" });
  }
};
const GithubCallback = async (req, res) => {
  try {
    const { id, email, username, GithubaccessToken, GithubrefreshToken } =
      req.user;

    // Check if the user exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user with random password
      user = await User.create({
        email,
        username,
        password: generateRandomPassword(),
        githubRefreshToken: GithubrefreshToken,
        githubAccessToken: GithubaccessToken,
      });
    } else {
      // Update user with GitHub tokens
      user.githubAccessToken = GithubaccessToken;
      user.githubRefreshToken = GithubrefreshToken;
      await user.save();
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token (if needed)
    await redisClient.set(user.id.toString(), refreshToken);

    const redirectUrl = `${process.env.CLIENT_URL}/confirm?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&username=${username}&avatar=${user.avatar}&id=${user.id}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "GitHub OAuth login error" });
  }
};
const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const username = user.username;
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const resetLink = `${process.env.CLIENT_URL}/resetPassword/${user.id}/${resetToken}`;
    await sendEmail(
      ResetPassword({ ResetLink: resetLink, Name: username, Email: email })
    )
      .then((val) => {
        res
          .status(200)
          .json({ message: "Reset password link sent to your email !" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Error in sending email" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Reset Password error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { userID } = req.params;
    const { Newpassword } = req.body;
    console.log(userID);
    if (!userID || !Newpassword) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(Newpassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userID } });
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error in resetting password" });
  }
};
const validateResetPassword = async (req, res) => {
  try {
    const { userID, resetToken } = req.params;
    if (!userID || !resetToken) {
      return res
        .status(400)
        .json({ message: "Invalid reset password link", valid: false });
    }
    jwt.verify(
      resetToken,
      process.env.RESET_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid reset password link", valid: false });
        } else {
          if (user.id !== userID) {
            return res
              .status(403)
              .json({ message: "Invalid reset password link", valid: false });
          }
          const TempToken = generateAccessToken(user);
          return res.status(200).json({
            message: "Valid reset password link",
            valid: true,
            TempToken,
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Error in validating reset password", valid: false });
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  GithubCallback,
  GoogleCallback,
  requestResetPassword,
  validateResetPassword,
  resetPassword,
};
