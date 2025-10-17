import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP failed:", err);
  else console.log("✅ SMTP server ready");
});

const sendEmail = async (to, subject, body) => {
  await transporter.sendMail({
    from: `"UOR Canteen" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    text: body,
  });
};

export default sendEmail;
