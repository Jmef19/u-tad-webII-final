const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 2525,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const EmailService = {
  async sendValidationEmail(to, code) {
    await transporter.sendMail({
      from: '"NoReply" <noreply@example.com>',
      to,
      subject: "Email Verification",
      text: `Your verification code is: ${code}`,
    });
  },
};

module.exports = EmailService;
