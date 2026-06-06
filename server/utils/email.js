const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // For demo/hackathon purposes, using an ethereal fake SMTP account or a simple fallback
    // In production, configure with actual SMTP credentials via environment variables
    
    // Create a testing account on the fly if no env vars are provided
    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // or any other service
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Fallback for hackathon mock (logs to console instead of failing)
      console.log('----------------------------------------------------');
      console.log(`[MOCK EMAIL NOTIFICATION]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${text || html}`);
      console.log('----------------------------------------------------');
      return true;
    }

    const mailOptions = {
      from: `"SmartHR System" <no-reply@smarthr.com>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    return null;
  }
};

module.exports = sendEmail;
