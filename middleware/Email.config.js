const nodemailer = require('nodemailer');

// Create transporter using nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "sohialshahid706@gmail.com",
      pass: "xnmi zvfa ofou mjao",
    },
});

// Export the transporter object
module.exports = transporter;
