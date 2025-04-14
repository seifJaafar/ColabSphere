const express = require("express");
const {
  login,
  refreshToken,
  logout,
  register,
  GithubCallback,
  GoogleCallback,
  requestResetPassword,
  validateResetPassword,
  resetPassword,
} = require("../controllers/authController");
const passport = require("passport");
const authorize = require("../middleware/authMiddleware");
const validateRegister = require("../Validators/RegisterValidator");
const validateLogin = require("../Validators/LoginValidator");

const router = express.Router();
router.get("/googleAuth", (req, res, next) => {
  const state = req.query.userId
    ? JSON.stringify({ userId: req.query.userId })
    : undefined;
  const authenticator = passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.acls",
      "https://www.googleapis.com/auth/calendar.acls.readonly",
    ],
    state: state,
    session: false,
    accessType: "offline", // Required to get refresh tokens
    prompt: "consent",
  });
  authenticator(req, res, next);
});

// Google account linking with Drive scope

// Google callback - handles both flows
router.get(
  "/googleAuth/callback",
  passport.authenticate("google", { session: false }),
  GoogleCallback
);

router.get(
  "/githubAuth",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubAuth/callback",
  passport.authenticate("github", { session: false }),
  GithubCallback
);

router.post("/login", validateLogin, login);
router.post("/requestResetPassword", requestResetPassword);
router.post("/register", validateRegister, register);
router.post("/refresh", refreshToken);

router.put("/resetPassword/:userID", authorize(), resetPassword);
router.get("/validateReset/:userID/:resetToken", validateResetPassword);
router.post("/logout", authorize(), logout);

module.exports = router;
