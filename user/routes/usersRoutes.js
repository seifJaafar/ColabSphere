const express = require("express");
const {
  UpdateProfile,
  GetPublicInfo,
  UpdatePassword,
} = require("../controllers/userController");
const authorize = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get("/publicInfo", authorize(), GetPublicInfo);
router.put("/updatePassword/:id", authorize(), UpdatePassword);
router
  .route("/updateProfile/:id")
  .put(authorize(), upload.single("avatar"), UpdateProfile);
module.exports = router;
