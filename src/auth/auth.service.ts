import { RoleEnum } from './../enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtPayload } from './interfaces';
import { Customer, Staff } from '../database/entities';
import { Twilio } from 'twilio';
import { templateHtml } from './../utils';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private jwtService = new JwtService();
  private twilioClient: Twilio;
  constructor(
    private readonly configService: ConfigService,
    private dataSource: DataSource,
  ) {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // validate User
  async validateUser(email: string, password: string) {
    let user: Customer | Staff;

    // check userExist by username
    const staff = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { email, deletedAt: null } });

    if (!staff) {
      user = await this.dataSource
        .getRepository(Customer)
        .findOne({ where: { email, deletedAt: null } });
    }

    if (!staff && !user) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }

    const isMatch = await this.comparePassword(
      password,
      staff ? staff['password'] : user['password'],
    );

    if (!isMatch) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }

    return staff ? staff : user;
  }

  // Compare password input and password user
  async comparePassword(data: string, encrypted: string) {
    return new Promise(async (resolve) => {
      await bcrypt.compare(data, encrypted, async (err, isMatch) => {
        if (err) return err;
        resolve(isMatch);
      });
    });
  }

  async validateUserByJwt(payload: JwtPayload) {
    let user: Customer | Staff;
    let access_token: string;

    if (payload.type === RoleEnum.STAFF) {
      user = await this.dataSource.getRepository(Staff).findOne({
        where: { id: payload.id, deletedAt: null },
      });
      access_token = user.accessToken;
    }

    if (payload.type === RoleEnum.CUSTOMER) {
      user = await this.dataSource
        .getRepository(Customer)
        .findOne({ where: { id: payload.id, deletedAt: null } });
      access_token = user.accessToken;
    }

    if (!user) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }
    return {
      id: user.id,
      email: user.email,
      access_token,
    };
  }

  async hashData(data: string) {
    return bcrypt.hashSync(data, await bcrypt.genSalt());
  }

  async createTokens(user: Customer | Staff, type: RoleEnum) {
    const data: JwtPayload = {
      id: user.id,
      email: user.email,
      type: type,
    };

    // at =>>>> AccessToken
    // rt =>>>> RefreshToken
    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      }),
      await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async sendPhoneCodeOtp(phoneNumber: string, code: string) {
    const companyName = this.configService.get('COMPANY_NAME');
    try {
      const message = `${companyName} - Mã OTP của bạn là: ${code}`;
      const response = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+84${phoneNumber.slice(1)}`,
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('SEND_SMS_FAILED');
    }
  }

  async sendEmailCodeOtp(email: string, otp: string, otpExpireMinute) {
    const fromEmail = this.configService.get('EMAIL');
    const companyName = this.configService.get('COMPANY_NAME');
    const transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: fromEmail,
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const options = {
      from: fromEmail,
      to: email,
      subject: `${companyName} - Mã OTP xác nhận`,
      html: templateHtml(otp, otpExpireMinute),
    };
    await transporter.sendMail(options);
  }

  async sendPasswordToEmail(email: string, password: string) {
    const clientId = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');
    const redirectUrl = this.configService.get('REDIRECT_URL');
    const refreshToken = this.configService.get('REFRESH_TOKEN');
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      
      const fromEmail = this.configService.get('EMAIL');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
          type: 'OAuth2',
          user: fromEmail,
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });
      
      const companyName = this.configService.get('COMPANY_NAME');
      const options = {
        from: `"${companyName}" <${fromEmail}>`,
        to: email,
        subject: `${companyName} - Mật khẩu tài khoản admin của bạn`,
        html: templateHtml(null, null, password),
      };
      await transporter.sendMail(options);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('SEND_EMAIL_FAILED');
    }
    

  }
}
