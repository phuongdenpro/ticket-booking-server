import * as nodeMailer from 'nodemailer';

export class MailerUtil {
  private mailHost = 'smtp.gmail.com';
  private mailPort = 587;

  async sendMail(
    email: string,
    password: string,
    to: string,
    subject: string,
    htmlContent,
  ) {
    const transporter = nodeMailer.createTransport({
      host: this.mailHost,
      port: this.mailPort,
      secure: false,
      auth: {
        user: email,
        pass: password,
      },
    });

    const options = {
      from: email,
      to,
      subject,
      html: htmlContent,
    };

    return transporter.sendMail(options);
  }
}
