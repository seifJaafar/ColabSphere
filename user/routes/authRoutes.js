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
router.get(
  "/googleAuth",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/githubAuth",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/googleAuth/callback",
  passport.authenticate("google", { session: false }),
  GoogleCallback
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
