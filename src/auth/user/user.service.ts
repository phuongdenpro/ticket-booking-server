import { Customer } from 'src/database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/enums';
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/regex.util';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UserUpdatePasswordDto, UserLoginDto, UserRegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(Customer) private userRepository: Repository<Customer>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string, options?: any) {
    return this.userRepository.findOne({ where: { id }, ...options });
  }

  async findOneByEmail(username: string, options?: any) {
    return this.userRepository.findOne({
      where: { email: username },
      ...options,
    });
  }

  async updateUserCredentialByUserId(userId: string, data: any) {
    return this.userRepository.update({ id: userId }, data);
  }

  async register(dto: UserRegisterDto) {
    // if (!dto.username.match(USERNAME_REGEX))
    //   throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    if (!dto.phone.match(PHONE_REGEX)) {
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    }
    if (dto.email && !dto.email.match(EMAIL_REGEX)) {
      throw new BadRequestException('INVALID_EMAIL');
    }

    const userExist = await this.findOneByEmail(dto.email);
    if (userExist) {
      throw new BadRequestException('USERNAME_ALREADY_EXIST');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const user = new Customer();
      user.password = passwordHashed;
      user.fullName = dto.name;
      user.phone = dto.phone;
      user.email = dto.email;
      user.gender = dto.gender;
      user.birthday = dto.birthday;

      await queryRunner.commitTransaction();
      const userCreated = await this.userRepository.save(user);
      delete userCreated.createdAt;
      delete userCreated.updatedAt;
      delete userCreated.deletedAt;
      delete userCreated.createdBy;
      delete userCreated.updatedBy;
      delete userCreated.password;

      return userCreated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async profile(id: string) {
    const userExist = this.findOneById(id);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async login(dto: UserLoginDto) {
    const userExist = await this.findOneByEmail(dto.email);

    if (!userExist) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }

    if (!userExist?.password) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }

    const isPasswordMatches = await this.authService.comparePassword(
      dto?.password,
      userExist?.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const tokens = await this.authService.createTokens(
        userExist,
        RoleEnum.CUSTOMER,
      );

      await this.updateUserCredentialByUserId(userExist.id, {
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        lastLogin: new Date(),
      });
      await queryRunner.commitTransaction();

      return tokens;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async logout(userId: any) {
    return await this.updateUserCredentialByUserId(userId, {
      refreshToken: null,
      accessToken: null,
    });
  }

  async refreshTokens(adminId: any) {
    const userExist = await this.findOneById(adminId);
    if (!userExist || !userExist.refreshToken)
      throw new UnauthorizedException();

    const tokens = await this.authService.createTokens(
      userExist,
      RoleEnum.CUSTOMER,
    );
    // const tokenHash = await this.authService.hashData(tokens.refresh_token);
    await this.updateUserCredentialByUserId(userExist.id, {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
    });

    console.log(userExist);
    return tokens;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.findOneById(id);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    const isPasswordMatches = await bcrypt.compare(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    // if (!isPasswordMatches) throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');

    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(),
    );
    return await this.userRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }
}
