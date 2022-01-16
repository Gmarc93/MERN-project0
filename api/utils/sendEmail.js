const nodemailer = require('nodemailer');

async function sendEmail(data) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: 'MERN-project0',
      to: data.email,
      subject: data.subject,
      text: data.message,
    });

    return info;
  } catch (err) {
    throw err;
  }
}

module.exports = sendEmail;
