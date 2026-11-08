import nodemailer from "nodemailer";
import { ENV } from "#utils/config";

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

if (ENV.SMPT_AVAILABLE) {
  transporter = nodemailer.createTransport({
    host: ENV.SMPT_HOST, // Replace with your SMTP provider host
    port: ENV.SMPT_PORT, // 465 for secure (SSL), 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
      user: ENV.SMPT_USER,
      pass: ENV.SMPT_PASS, // Use an App Password, not your raw password
    },
  });
}

export function sendEmail(to: string, subject: string, text: string) {
  if (ENV.SMPT_SENDER) {
    try {
      transporter?.sendMail({
        from: ENV.SMPT_SENDER,
        to,
        subject,
        text,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
