import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { email } from 'src/dto/email/email.dto';

@Injectable()
export class EmailService {
  async sendEmail(data: email) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    if (!data.attachments) {
      const mailOptions = {
        from: data.from,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      };
      const result = await transporter.sendMail(mailOptions);
      await transporter.close();
      return result;
    } else {
      const mailOptions = {
        from: data.from,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      };
      const result = await transporter.sendMail(mailOptions);
      await transporter.close();
      return result;
    }
  }
}
