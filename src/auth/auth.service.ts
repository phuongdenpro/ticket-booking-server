import { RoleEnum } from './../enums';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtPayload } from './interfaces';
import { Customer, Staff } from '../database/entities';
import { Twilio } from 'twilio';
import nodemailer from 'nodemailer';
import { templateHtml } from './../utils';

@Injectable()
export class AuthService {
  private jwtService = new JwtService();
  private configService = new ConfigService();
  constructor(private dataSource: DataSource) {}

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
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    const phoneNumberFrom = this.configService.get('TWILIO_PHONE_NUMBER');
    const client = new Twilio(accountSid, authToken);

    const message = `Mã OTP của bạn là: ${code}`;
    const data = {
      body: message,
      from: phoneNumberFrom,
      to: phoneNumber,
    };
    await client.messages.create(data).then((message) => message);
  }

  async sendEmailCodeOtp(email: string, otp: string, otpExpireMinute) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
    await transporter.sendMail(
      email,
      'PD Bus - OTP xác nhận tài khoản',
      templateHtml(otp, otpExpireMinute),
    );
  }
}
