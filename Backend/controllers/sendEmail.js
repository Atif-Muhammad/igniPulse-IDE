const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
  };

  return await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;