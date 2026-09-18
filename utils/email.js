import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

export async function sendEmail(options) {
  console.log("EMAIL CONFIG:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    passwordExists: !!process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `My Ecommerce App. <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
}
