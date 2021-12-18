const nodemailer = require('nodemailer');

async function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_EMAIL_HOST,
    port: process.env.SEND_EMAIL_PORT,
    auth: {
      user: process.env.SEND_EMAIL_USERNAME,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'MERN-project0.io',
    to: data.email,
    subject: data.subject,
    text: data.message,
  });
}

module.exports = sendEmail;
