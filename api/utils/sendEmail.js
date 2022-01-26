'use strict';

const nodemailer = require('nodemailer');

async function sendEmail(data) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: 'MERN-project0 <MERN-project0@io.com>',
      to: data.email,
      subject: data.subject,
      text: data.message,
      // html: '<b>Hello world?</b>',
    });

    return info;
  } catch (err) {
    throw err;
  }
}

module.exports = sendEmail;
