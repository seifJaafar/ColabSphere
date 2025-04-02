const dotenv = require("dotenv");
const db = require("../models/index");
const axios = require("axios");
const FormData = require("form-data"); // ✅ Import form-data
const bcrypt = require("bcrypt");
const { producer } = require("../config/kafka");
const { User } = db;
dotenv.config();

const UpdatePassword = async (req, res) => {
  try {
    const { previousPassword, newPassword } = req.body;
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userID, {
      attributes: ["id", "password"], // Ensure the password field is included
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User password is missing from the database" });
    }

    // ✅ Check if the previous password matches the stored password
    const passwordMatch = await bcrypt.compare(previousPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the password with a proper `where` clause
    await User.update(
      { password: hashedPassword },
      { where: { id: userID } } // This was missing
    );

    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Password error" });
  }
};
const UpdateProfile = async (req, res) => {
  try {
    const { email, username } = req.body;
    const userID = req.params.id;
    const avatarFile = req.file;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateData = {}; // Store only fields that need to be updated

    // ✅ Check if the new username exists (and belongs to a different user)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      updateData.username = username;
    }

    // ✅ Check if the new email exists (and belongs to a different user)
    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updateData.email = email;
    }

    // ✅ Handle avatar upload if a new file is provided
    if (avatarFile && avatarFile.size > 0) {
      const eventPayload = {
        userID,
        filename: avatarFile.originalname,
        mimetype: avatarFile.mimetype,
        buffer: avatarFile.buffer.toString("base64"), // Convert to base64 for transfer
      };
      await producer.send({
        topic: "file-upload",
        messages: [{ value: JSON.stringify(eventPayload) }],
      });
      /*const formData = new FormData();
      formData.append("avatar", avatarFile.buffer, {
        filename: avatarFile.originalname,
        contentType: avatarFile.mimetype,
      });
      formData.append("userID", userID);

      const uploadResponse = await axios.post(
        `${process.env.API_GATEWAY}/filesService/files/avatar`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: req.headers.authorization,
          },
        }
      );

      updateData.avatar = uploadResponse.data.url; */
    }

    // ✅ Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      const [updatedCount, updatedUsers] = await User.update(updateData, {
        where: { id: userID },
        returning: ["id", "email", "username", "avatar"], // Select specific fields
      });
      const updatedUser = updatedUsers[0];
      return res.status(200).json({ message: "Profile Updated", updatedUser }); // Get the updated user data
    }
    return res.status(200).json({ message: "No changes", updatedUser: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Profile error" });
  }
};
const GetPublicInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userID = req.user.id;
    console.log(userID, "userID");
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findOne({
      where: { id: userID },
      attributes: ["id", "username", "avatar", "email"], // Selecting specific fields
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.dataValues, "user");
    res.status(200).json(user.dataValues);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Get Public Info error" });
  }
};
module.exports = {
  UpdateProfile,
  UpdatePassword,
  GetPublicInfo,
};
