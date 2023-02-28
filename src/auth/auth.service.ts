import { RoleEnum } from './../enums/roles.enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtPayload } from './interfaces';
import { Customer } from '../database/entities/customer.entities';
import { Staff } from '../database/entities/staff.entities';

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
}
