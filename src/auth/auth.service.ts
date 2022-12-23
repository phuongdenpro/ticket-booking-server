import { AdminUser,User } from 'src/database/entities';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from 'src/enums';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private jwtService = new JwtService();
  private configService = new ConfigService();
  constructor(private dataSource: DataSource) {}

  // validate User
  async validateUser(username: string, password: string) {
    let user: User | AdminUser;

    // check userExist by username
    const admin = await this.dataSource
      .getRepository(AdminUser)
      .findOne({ where: { username, deletedAt: null }, relations: ['adminUserCredential'] });

    if (!admin) {
      user = await this.dataSource
        .getRepository(User)
        .findOne({ where: { username, deletedAt: null }, relations: ['userCredential'] });
    }

    if (!admin && !user) throw new UnauthorizedException('WRONG_CREDENTIALS');

    const isMatch = await this.comparePassword(
      password,
      admin ? admin['adminUserCredential']['password'] : user['userCredential']['password']
    );

    if (!isMatch) throw new UnauthorizedException('WRONG_CREDENTIALS');

    return admin ? admin : user;
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
    let user: User | AdminUser;
    let access_token: string;

    if (payload.type === RoleEnum.ADMIN) {
      user = await this.dataSource.getRepository(AdminUser).findOne({
        where: { id: payload.id, deletedAt: null },
        relations: ['adminUserCredential'],
      });
      access_token = user.adminUserCredential.access_token;
    }

    if (payload.type === RoleEnum.CUSTOMER) {
      user = await this.dataSource
        .getRepository(User)
        .findOne({ where: { id: payload.id, deletedAt: null }, relations: ['userCredential'] });
      access_token = user.userCredential.access_token;
    }

    if (!user) throw new UnauthorizedException('WRONG_CREDENTIALS');
    return {
      id: user.id,
      username: user.username,
      access_token,
    };
  }

  async hashData(data: string) {
    return bcrypt.hashSync(data, await bcrypt.genSalt());
  }

  async createTokens(user: User | AdminUser, type: RoleEnum) {
    const data: JwtPayload = {
      id: user.id,
      username: user.username,
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
