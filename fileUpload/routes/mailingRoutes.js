const express = require("express");
const { ResetPasswordrequest } = require("../controllers/MailController");

const router = express.Router();

router.post("/resetpassword", ResetPasswordrequest);

module.exports = router;
