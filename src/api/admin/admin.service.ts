import { ActiveOtpTypeEnum } from './../../enums';
import { AuthService } from './../../auth/auth.service';
import { Staff } from './../../database/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminResetPasswordDto, AdminUpdatePasswordDto } from './dto';
import { ConfirmAccountDto } from '../user/dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Staff)
    private readonly adminRepository: Repository<Staff>,
    private authService: AuthService,
  ) {}

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

  async findOneAdmin(options?: any) {
    return await this.adminRepository.findOne({
      where: { ...options?.where },
      relations: { ...options?.relations },
      select: {
        id: true,
        lastLogin: true,
        isActive: true,
        phone: true,
        email: true,
        fullName: true,
        gender: true,
        address: true,
        note: true,
        birthDay: true,
        code: true,
        createdAt: true,
        isManage: true,
        ...options?.select,
      },
      ...options?.other,
    });
  }

  async findOneById(id: string, options?: any) {
    if (!id) {
      throw new BadRequestException('ID_REQUIRED');
    }
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneAdmin(options);
  }

  async findOneByPhone(phone: string, options?: any) {
    if (!phone) {
      throw new BadRequestException('PHONE_REQUIRED');
    }
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }

    return await this.findOneAdmin(options);
  }

  async findOneByEmail(email: string, options?: any) {
    if (!email) {
      throw new BadRequestException('EMAIL_REQUIRED');
    }
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }

    return await this.findOneAdmin(options);
  }

  async findOneByRefreshToken(refreshToken: string, options?: any) {
    if (!refreshToken) {
      throw new BadRequestException('REFRESH_TOKEN_REQUIRED');
    }
    if (options) {
      options.where = {
        refreshToken,
        ...options?.where,
        select: {
          refreshToken: true,
          accessToken: true,
          ...options?.select,
        },
      };
    } else {
      options = {
        where: { refreshToken },
        select: {
          refreshToken: true,
          accessToken: true,
        },
      };
    }
    return await this.findOneAdmin(options);
  }

  async getAdminById(id: string, options?: any) {
    const staffExist = await this.findOneById(id, options);
    if (!staffExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return staffExist;
  }

  async profile(adminId: string) {
    const staffExist = this.findOneById(adminId);
    return staffExist;
  }

  async updatePassword(id: string, dto: AdminUpdatePasswordDto) {
    const userExist = await this.findOneById(id);
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (!userExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const isPasswordMatches = await this.authService.comparePassword(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    }
    if (dto?.newPassword !== dto?.confirmNewPassword) {
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    }

    const passwordHash = await this.authService.hashData(dto.newPassword);
    return await this.adminRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }

  async updateOtp(
    id: string,
    otpCode: string,
    otpExpired: Date,
    otpType?: ActiveOtpTypeEnum,
  ) {
    const admin = await this.getAdminById(id);
    admin.otpCode = otpCode;
    admin.otpExpired = otpExpired;
    if (otpType && otpType === ActiveOtpTypeEnum.RESET_PASSWORD) {
      admin.noteStatus = ActiveOtpTypeEnum.RESET_PASSWORD;
    }
    const saveCustomer = await this.adminRepository.save(admin);
    return saveCustomer;
  }

  async updateActive(id: string) {
    const admin = await this.getAdminById(id);
    if (admin.isActive) {
      throw new BadRequestException('USER_ALREADY_ACTIVE');
    }
    admin.isActive = true;
    admin.otpCode = null;
    admin.otpExpired = null;
    const saveCustomer = await this.adminRepository.save(admin);
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
    let staff: Staff;
    if (phone) {
      staff = await this.findOneByPhone(phone, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    } else if (email) {
      staff = await this.findOneByEmail(email, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    }
    if (!staff) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    this.checkOTP(otp, staff.otpCode, staff.otpExpired);
    let saveStaff: Staff;
    let message = 'xác thực đặt lại mật khẩu thành công';
    // if (type === ActiveOtpTypeEnum.ACTIVE) {
    //   saveStaff = await this.updateActive(staff.id);
    // } else if (type === ActiveOtpTypeEnum.RESET_PASSWORD) {
    // }
    saveStaff = await this.updateOtp(
      staff.id,
      null,
      null,
      ActiveOtpTypeEnum.RESET_PASSWORD,
    );

    return {
      customer: {
        id: saveStaff.id,
      },
      message,
    };
  }

  async resetPassword(dto: AdminResetPasswordDto) {
    const { phone, email, otp, newPassword, confirmNewPassword } = dto;
    if (!phone && !email) {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }
    if (!otp) {
      throw new BadRequestException('OTP_REQUIRED');
    }
    if (!newPassword) {
      throw new BadRequestException('NEW_PASSWORD_REQUIRED');
    }
    if (!confirmNewPassword) {
      throw new BadRequestException('CONFIRM_NEW_PASSWORD_REQUIRED');
    }
    let admin: Staff;
    if (phone) {
      admin = await this.findOneByPhone(phone, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    } else if (email) {
      admin = await this.findOneByEmail(email, {
        select: {
          otpCode: true,
          otpExpired: true,
        },
      });
    }
    if (!admin) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    // if (!admin.isActive) {
    //   throw new BadRequestException('USER_NOT_ACTIVE');
    // }
    this.checkOTP(otp, admin.otpCode, admin.otpExpired);
    if (newPassword !== confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    const passwordHash = await this.authService.hashData(newPassword);
    admin.password = passwordHash;
    admin.updatedBy = admin.id;
    admin.otpCode = null;
    admin.otpExpired = null;
    admin.refreshToken = null;
    admin.accessToken = null;
    const saveCustomer = await this.adminRepository.save(admin);
    delete saveCustomer.password;
    delete saveCustomer.updatedBy;
    delete saveCustomer.refreshToken;
    delete saveCustomer.accessToken;

    return saveCustomer;
  }
}
