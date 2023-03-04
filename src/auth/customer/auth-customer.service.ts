import { CustomerService } from '../../api/customer/customer.service';
import { Customer } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum, RoleEnum } from '../../enums';
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/regex.util';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { CustomerLoginDto, CustomerRegisterDto } from './dto';

@Injectable()
export class AuthCustomerService {
  constructor(
    @InjectRepository(Customer) private userRepository: Repository<Customer>,
    private authService: AuthService,
    private customerService: CustomerService,
    private dataSource: DataSource,
  ) {}

  async updateUserCredentialByUserId(userId: string, data: any) {
    return this.userRepository.update({ id: userId }, data);
  }

  async register(dto: CustomerRegisterDto) {
    const { email, fullName, gender, birthday, phone } = dto;
    if (email) {
      if (!email.match(EMAIL_REGEX)) {
        throw new BadRequestException('INVALID_EMAIL');
      }
      const userEmailExist = await this.customerService.findOneByEmail(email);
      if (userEmailExist) {
        throw new BadRequestException('EMAIL_ALREADY_EXIST');
      }
    }

    if (!phone.match(PHONE_REGEX)) {
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    }
    const userPhoneExist = await this.customerService.findOneByPhone(phone);
    if (userPhoneExist) {
      throw new BadRequestException('PHONE_ALREADY_EXIST');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const user = new Customer();
      user.password = passwordHashed;
      user.fullName = fullName;
      user.phone = phone;
      user.email = email;
      if (!gender) {
        user.gender = GenderEnum.OTHER;
      } else {
        user.gender = gender;
      }
      if (birthday) {
        user.birthday = birthday;
      } else {
        user.birthday = new Date('01-02-1970');
      }
      user.status = 0;
      await queryRunner.commitTransaction();
      // save and select return fields
      const {
        createdAt,
        updatedAt,
        deletedAt,
        updatedBy,
        password,
        refreshToken,
        accessToken,
        ...saveUser
      } = await this.userRepository.save(user);

      return saveUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(dto: CustomerLoginDto) {
    const { email, password } = dto;
    const userExist = await this.customerService.findOneByEmail(email, {
      select: ['password', 'id'],
    });
    if (!userExist) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }
    if (!userExist?.password) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }

    const isPasswordMatches = await this.authService.comparePassword(
      password,
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

  async refreshTokens(refreshToken: string) {
    const userExist = await this.customerService.findCustomerByRefreshToken(
      refreshToken,
    );
    if (!userExist || !userExist.refreshToken)
      throw new UnauthorizedException('UNAUTHORIZED');

    const tokens = await this.authService.createTokens(
      userExist,
      RoleEnum.CUSTOMER,
    );

    await this.updateUserCredentialByUserId(userExist.id, {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
    });

    return tokens;
  }
}
