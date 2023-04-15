import { AuthService } from './../../auth/auth.service';
import { AuthAdminService } from '../../auth/admin/auth-admin.service';
import { Staff } from './../../database/entities/staff.entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminResetPasswordDto, AdminUpdatePasswordDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Staff)
    private readonly adminRepository: Repository<Staff>,
    private authAdminService: AuthAdminService,
    private authService: AuthService,
  ) {}

  private checkOTP(sendOTP, dbOTP, otpTime) {
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

  async findOneAdmin(options: any) {
    return this.adminRepository.findOne({
      where: { ...options?.where },
      select: {
        deleteAt: false,

        ...options?.select,
      },
      relations: { ...options?.relations },
      order: { ...options?.order },
      ...options?.other,
    });
  }

  async findOneByPhone(phone: string, options?: any) {
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }

    return await this.findOneAdmin(options);
  }

  async findOneByEmail(email: string, options?: any) {
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }

    return await this.findOneAdmin(options);
  }

  async profile(adminId: string) {
    const staffExist = this.authAdminService.findOneById(adminId);
    return staffExist;
  }

  async updatePassword(id: string, dto: AdminUpdatePasswordDto) {
    const userExist = await this.authAdminService.findOneById(id);
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

  async findOneBydId(id: string, options?: any) {
    return await this.authAdminService.findOneById(id, options);
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
