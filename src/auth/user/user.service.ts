import { User, UserCredential } from 'src/database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/enums';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from '../../utils/regex.util';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserCredential)
    private userCredentialRepository: Repository<UserCredential>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string, options?: any) {
    return this.userRepository.findOne({ where: { id }, ...options });
  }

  async findOneByUsername(username: string, options?: any) {
    return this.userRepository.findOne({
      where: { username: username.toLowerCase() },
      ...options,
    });
  }

  async updateUserCredentialByUserId(userId: string, data: any) {
    return this.userCredentialRepository.update({ user: { id: userId } }, data);
  }

  async register(dto: UserRegisterDto) {
    if (!dto.username.match(USERNAME_REGEX))
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    if (!dto.phone.match(PHONE_REGEX))
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    if (dto.email && !dto.email.match(EMAIL_REGEX))
      throw new BadRequestException('INVALID_EMAIL');

    const userExist = await this.findOneByUsername(dto.username);

    if (userExist) throw new BadRequestException('USERNAME_ALREADY_EXIST');

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const userCred = new UserCredential();
      userCred.password = passwordHashed;
      await this.userCredentialRepository.save(userCred);

      const user = new User();
      user.username = dto.username.toLowerCase();
      user.name = dto.name;
      user.phone = dto.phone;
      user.email = dto.email;
      user.birthDate = dto.birthDate;
      user.gender = dto.gender;
      // user.createdBy = adminExist ? adminExist.id : undefined;
      user.userCredential = userCred;
      await this.userRepository.save(user);

      await queryRunner.commitTransaction();
      return;
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
    const userExist = await this.findOneByUsername(dto.username, {
      relations: ['userCredential'],
    });
    if (!userExist)
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');

    if (!userExist?.userCredential?.password)
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');

    const isPasswordMatches = await this.authService.comparePassword(
      dto?.password,
      userExist?.userCredential?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const tokens = await this.authService.createTokens(
        userExist,
        RoleEnum.CUSTOMER,
      );
      // const tokenHash = await this.authService.hashData(tokens.refresh_token);
      await this.updateUserCredentialByUserId(userExist.id, {
        ...tokens,
      });
      await queryRunner.commitTransaction();
      console.log(userExist);
      return tokens;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async logout(adminId: any) {
    return await this.updateUserCredentialByUserId(adminId, {
      refresh_token: null,
    });
  }

  async refreshTokens(adminId: any) {
    const userExist = await this.findOneById(adminId, {
      relations: ['userCredential'],
    });
    if (!userExist || !userExist.userCredential.refresh_token)
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
    const userExist = await this.findOneById(id, {
      relations: ['userCredential'],
    });
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    const isPasswordMatches = await bcrypt.compare(
      dto?.oldPassword,
      userExist?.userCredential?.password,
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
    return await this.userCredentialRepository.update(
      { user: userExist },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }
}
