const express = require("express");
const { UploadAvatar } = require("../controllers/FileController");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/avatar", upload.single("avatar"), UploadAvatar);

module.exports = router;
