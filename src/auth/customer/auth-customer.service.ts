import { CustomerService } from '../../api/customer/customer.service';
import { Customer, Ward } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum, RoleEnum, UserStatusEnum } from '../../enums';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { CustomerLoginDto, CustomerRegisterDto, SendOtpDto } from './dto';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
moment.locale('vi');

@Injectable()
export class AuthCustomerService {
  private configService = new ConfigService();
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
    const {
      email,
      fullName,
      gender,
      birthday,
      phone,
      wardCode,
      address,
      isOtp,
    } = dto;
    if (email) {
      const userEmailExist = await this.customerService.findOneByEmail(email);
      if (userEmailExist) {
        throw new BadRequestException('EMAIL_ALREADY_EXIST');
      }
    } else if (phone) {
      const userPhoneExist = await this.customerService.findOneByPhone(phone);
      if (userPhoneExist) {
        throw new BadRequestException('PHONE_ALREADY_EXIST');
      }
    } else {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    let saveUser: Customer;
    const otpCode = Math.floor(100000 + Math.random() * 900000) + '';
    const otpExpiredTime = this.configService.get('OTP_EXPIRE_MINUTE');
    const otpExpired = moment().add(otpExpiredTime, 'minutes').toDate();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: { code: wardCode ? wardCode : 0 },
        relations: { district: { province: true } },
      });
      if (!ward) {
        throw new BadRequestException('WARD_NOT_FOUND');
      }

      const user = new Customer();
      user.password = passwordHashed;
      user.fullName = fullName;
      user.phone = phone;
      user.email = email;
      user.ward = ward;
      if (address) {
        user.address = address;
      } else {
        user.address = 'Không xác định';
      }
      if (wardCode) {
        user.fullAddress = `${address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
      } else {
        user.fullAddress = 'Không xác định';
      }
      if (!gender) {
        user.gender = GenderEnum.OTHER;
      } else {
        user.gender = gender;
      }
      if (birthday) {
        user.birthday = birthday;
      } else {
        user.birthday = new Date('01-01-1970');
      }
      user.status = UserStatusEnum.INACTIVATE;
      user.otpCode = otpCode;
      user.otpExpired = otpExpired;

      await queryRunner.commitTransaction();
      // save and select return fields
      saveUser = await this.userRepository.save(user);
      delete saveUser.createdAt;
      delete saveUser.updatedAt;
      delete saveUser.deletedAt;
      delete saveUser.updatedBy;
      delete saveUser.password;
      delete saveUser.refreshToken;
      delete saveUser.accessToken;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
    if (isOtp) {
      if (email) {
        await this.authService.sendEmailCodeOtp(email, otpCode, otpExpiredTime);
      } else {
        await this.authService.sendPhoneCodeOtp(phone, otpCode);
      }
    }

    return saveUser;
  }

  async login(dto: CustomerLoginDto) {
    const { email, phone, password } = dto;
    const userEmailExist = await this.customerService.findOneByEmail(email, {
      select: {
        id: true,
        password: true,
      },
    });
    const userPhoneExist = await this.customerService.findOneByPhone(phone, {
      select: {
        id: true,
        password: true,
      },
    });
    if (userEmailExist) {
      if (!userEmailExist?.password) {
        throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
      }
    } else if (userPhoneExist) {
      if (!userPhoneExist?.password) {
        throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
      }
    } else {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }
    const user = userEmailExist || userPhoneExist;
    const isPasswordMatches = await this.authService.comparePassword(
      password,
      user?.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const tokens = await this.authService.createTokens(
        user,
        RoleEnum.CUSTOMER,
      );

      await this.updateUserCredentialByUserId(user.id, {
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

  async sendOtp(dto: SendOtpDto) {
    const { email, phone } = dto;
    let customer: Customer;
    if (email) {
      customer = await this.customerService.findOneByEmail(email);
    } else if (phone) {
      customer = await this.customerService.findOneByPhone(phone);
    } else {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }
    if (!customer) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000) + '';
    const otpExpiredTime = this.configService.get('OTP_EXPIRE_MINUTE');
    const otpExpired = moment().add(otpExpiredTime, 'minutes').toDate();

    const saveCustomer = await this.customerService.updateOtpCustomer(
      customer.id,
      otpCode,
      otpExpired,
    );
    if (!saveCustomer) {
      throw new BadRequestException('SEND_OTP_FAILED');
    }
    if (email) {
      await this.authService.sendEmailCodeOtp(email, otpCode, otpExpiredTime);
    } else {
      await this.authService.sendPhoneCodeOtp(phone, otpCode);
    }

    return {
      customer: {
        id: customer.id,
      },
      message: 'Gửi mã OTP thành công',
    };
  }
}
