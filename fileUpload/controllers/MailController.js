const { sendEmail, ResetPassword } = require("../config/mailing");

const ResetPasswordrequest = async (req, res) => {
  try {
    const { username, resetLink, email } = req.body;
    if (!username || !resetLink || !email) {
      return res
        .status(400)
        .json({ message: "Username , resetLink and email are required" });
    }
    await sendEmail(
      ResetPassword({ ResetLink: resetLink, Name: username, Email: email })
    )
      .then((val) => {
        console.log(val);
        res.status(200).json({ message: "Email sent successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error in sending email" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  ResetPasswordrequest,
};
