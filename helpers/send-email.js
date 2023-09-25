const nodemailer = require("nodemailer");

const nodemailerUser = process.env.NODEMAILER_USER;
const nodemailerPass = process.env.NODEMAILER_PASS;

const sendEmail = async (name, email, password = "") => {
  let html = `
         <h3>User Information</h3>
         <p>Thanks for using Ramirez Alejandro's Rest Server. For more information reply to this email.</p>
         `;

  const config = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: nodemailerUser,
      pass: nodemailerPass,
    },
  };

  const message = {
    from: nodemailerUser,
    to: email,
    subject: "This is an email from Ramirez Alejandro's RestServer",
    html,
  };

  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail(message);
};

module.exports = {
  sendEmail,
};
