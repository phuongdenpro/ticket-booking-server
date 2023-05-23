import { ActiveOtpTypeEnum, UserStatusEnum } from './../../enums';
import { Customer } from './../../database/entities';
import { AuthService } from './../../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { Repository } from 'typeorm';
import {
  ConfirmAccountDto,
  UpdateCustomerDto,
  UserResetPasswordDto,
  UserUpdatePasswordDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@ApiTags('User')
export class UserService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private customerService: CustomerService,
    private authService: AuthService,
  ) {}

  async getCustomerStatus() {
    return this.customerService.getCustomerStatus();
  }

  async profile(id: string) {
    const userExist = this.customerService.getCustomerById(id);
    if (!userExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.customerService.getCustomerById(id, {
      select: { password: true },
    });
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (userExist?.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!dto?.oldPassword) {
      throw new BadRequestException('OLD_PASSWORD_REQUIRED');
    }
    if (!dto?.newPassword) {
      throw new BadRequestException('NEW_PASSWORD_REQUIRED');
    }
    if (!dto?.confirmNewPassword) {
      throw new BadRequestException('CONFIRM_NEW_PASSWORD_REQUIRED');
    }
    const isPasswordMatches = await this.authService.comparePassword(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('PASSWORD_OLD_NOT_MATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    if (dto?.oldPassword === dto?.newPassword) {
      throw new BadRequestException('PASSWORD_NEW_SAME_OLD');
    }

    const passwordHash = await this.authService.hashData(dto.newPassword);
    userExist.password = passwordHash;
    userExist.updatedBy = userExist.id;
    const saveCustomer = await this.customerRepository.save(userExist);
    delete saveCustomer.password;
    delete saveCustomer.updatedBy;
    delete saveCustomer.refreshToken;
    delete saveCustomer.accessToken;

    return saveCustomer;
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto, userId: string) {
    return await this.customerService.updateCustomer(id, dto, userId);
  }

  async resetPassword(dto: UserResetPasswordDto) {
    const { phone, email, newPassword, confirmNewPassword } = dto;
    if (!phone && !email) {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }
    if (!newPassword) {
      throw new BadRequestException('NEW_PASSWORD_REQUIRED');
    }
    if (!confirmNewPassword) {
      throw new BadRequestException('CONFIRM_NEW_PASSWORD_REQUIRED');
    }
    let customer: Customer;
    if (phone) {
      customer = await this.customerService.findOneByPhone(phone, {
        select: { noteStatus: true },
      });
    } else if (email) {
      customer = await this.customerService.findOneByEmail(email, {
        select: { noteStatus: true },
      });
    }
    if (!customer) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (customer.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (customer.noteStatus !== ActiveOtpTypeEnum.RESET_PASSWORD) {
      throw new BadRequestException('USER_NOT_RESET_PASSWORD');
    }
    if (newPassword !== confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    const passwordHash = await this.authService.hashData(newPassword);
    customer.password = passwordHash;
    customer.updatedBy = customer.id;
    customer.otpCode = null;
    customer.otpExpired = null;
    customer.refreshToken = null;
    customer.accessToken = null;
    const saveCustomer = await this.customerRepository.save(customer);
    delete saveCustomer.password;
    delete saveCustomer.updatedBy;
    delete saveCustomer.refreshToken;
    delete saveCustomer.accessToken;
    delete saveCustomer.otpCode;
    delete saveCustomer.otpExpired;
    delete saveCustomer.noteStatus;

    return saveCustomer;
  }

  async confirmAccount(dto: ConfirmAccountDto) {
    const { phone, email, otp, type } = dto;
    if (!phone && !email) {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }
    if (!otp) {
      throw new BadRequestException('OTP_REQUIRED');
    }
    let customer: Customer;
    if (phone) {
      customer = await this.customerService.findOneByPhone(phone, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    } else if (email) {
      customer = await this.customerService.findOneByEmail(email, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    }
    if (!customer) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (!type) {
      throw new BadRequestException('OTP_TYPE_IS_REQUIRED');
    }
    this.checkOTP(otp, customer.otpCode, customer.otpExpired);
    let saveCustomer: Customer;
    if (type === ActiveOtpTypeEnum.ACTIVE) {
      saveCustomer = await this.customerService.updateActive(customer.id);
    } else if (type === ActiveOtpTypeEnum.RESET_PASSWORD) {
      saveCustomer = await this.customerService.updateOtp(
        customer.id,
        null,
        null,
        ActiveOtpTypeEnum.RESET_PASSWORD,
      );
    }

    return {
      customer: {
        id: saveCustomer.id,
      },
      message: 'Kích hoạt tài khoản thành công',
    };
  }

  private checkOTP(sendOTP: string, dbOTP: string, otpTime: Date) {
    if (!dbOTP) {
      throw new BadRequestException('OTP_INVALID');
    }

    // check hết hạn otp
    if (new Date() > otpTime) {
      throw new BadRequestException('OTP_EXPIRED');
    }

    // nếu otp sai
    if (sendOTP !== dbOTP) {
      throw new BadRequestException('OTP_INVALID');
    }
  }
}
