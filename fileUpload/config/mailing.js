const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const EMAIL_TEMPLATE_BASE = path.join(__dirname, "../templates/emails/");
let emailClient = nodemailer.createTransport({
  host: String(process.env.EMAIL_HOST),
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: String(process.env.EMAIL_NODEMAILER),
    pass: String(process.env.PASSWORD_EMAIL),
  },
});

const template = (fileName, data) => {
  const content = fs.readFileSync(EMAIL_TEMPLATE_BASE + fileName).toString();
  const inject = handlebars.compile(content);
  return inject(data);
};

function sendEmail(data) {
  if (!emailClient) {
    return;
  }
  return new Promise((resolve, reject) => {
    emailClient
      ? emailClient.sendMail(data, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        })
      : "";
  });
}

function ResetPassword({ ResetLink, Name, Email }) {
  return {
    from: `ColabSphere <${process.env.EMAIL_NODEMAILER}>`,
    to: Email,
    subject: `Password Reset ${Name}`,
    html: template("ResetPassword.html", { ResetLink, Name }),
  };
}

module.exports = {
  sendEmail,

  ResetPassword,
};
