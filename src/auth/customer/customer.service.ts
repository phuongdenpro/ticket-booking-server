import { CustomerService } from '../../api/customer/customer.service';
import { Customer } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../../enums';
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
    if (!dto.phone.match(PHONE_REGEX)) {
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    }
    if (dto.email && !dto.email.match(EMAIL_REGEX)) {
      throw new BadRequestException('INVALID_EMAIL');
    }

    const userExist = await this.customerService.findOneByEmail(dto.email);
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
      const {
        createdAt,
        updatedAt,
        deletedAt,
        updatedBy,
        password,
        ...newUser
      } = userCreated;

      return newUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async profile(id: string) {
    const userExist = this.customerService.findOneById(id);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async login(dto: CustomerLoginDto) {
    const userExist = await this.customerService.findOneByEmail(dto.email);

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

  async refreshTokens(refreshToken: string) {
    const userExist = await this.customerService.findOneByRefreshToken(
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
