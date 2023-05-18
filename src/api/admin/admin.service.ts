import { EMAIL_REGEX, PHONE_REGEX } from './../../utils/regex.util';
import { ActiveOtpTypeEnum, GenderEnum } from './../../enums';
import { AuthService } from './../../auth/auth.service';
import { Staff, Ward } from './../../database/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AdminResetPasswordDto,
  AdminUpdateDto,
  AdminUpdatePasswordDto,
  ConfirmAccountAdminDto,
} from './dto';
import * as moment from 'moment';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Staff)
    private readonly adminRepository: Repository<Staff>,
    private authService: AuthService,
    private dataSource: DataSource,
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
      relations: {
        ward: {
          district: {
            province: true,
          },
        },
        ...options?.relations,
      },
      select: {
        id: true,
        lastLogin: true,
        isActive: true,
        phone: true,
        email: true,
        fullName: true,
        gender: true,
        address: true,
        fullAddress: true,
        note: true,
        birthDay: true,
        code: true,
        isManage: true,
        createdAt: true,
        isFirstLogin: true,
        ward: {
          id: true,
          code: true,
          name: true,
          district: {
            id: true,
            code: true,
            name: true,
            province: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
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

  async updateProfile(dto: AdminUpdateDto, userId: string) {
    const staffExist = await this.findOneById(userId);
    if (!staffExist || userId !== staffExist.id) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (!staffExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const { email, phone, fullName, gender, address, birthDay, wardCode, otp } =
      dto;
    if (email) {
      if (!email.match(EMAIL_REGEX)) {
        throw new BadRequestException('INVALID_EMAIL');
      }
      if (email !== staffExist.email) {
        const emailExist = await this.findOneByEmail(email);
        if (emailExist && emailExist.id !== userId) {
          throw new BadRequestException('EMAIL_ALREADY_EXIST');
        }
        this.checkOTP(otp, staffExist.otpCode, staffExist.otpExpired);
        staffExist.email = email;
      }
    }
    if (phone) {
      if (!phone.match(PHONE_REGEX)) {
        throw new BadRequestException('INVALID_PHONE_NUMBER');
      }
      if (phone !== staffExist.phone) {
        const phoneExist = await this.findOneByPhone(phone);
        if (phoneExist && phoneExist.id !== userId) {
          throw new BadRequestException('EMAIL_ALREADY_EXIST');
        }
        this.checkOTP(otp, staffExist.otpCode, staffExist.otpExpired);
        staffExist.phone = phone;
      }
    }
    if (fullName) {
      if (!fullName.trim()) {
        throw new BadRequestException('FULL_NAME_IS_REQUIRED');
      }
      staffExist.fullName = fullName;
    }
    switch (gender) {
      case GenderEnum.FEMALE:
      case GenderEnum.MALE:
      case GenderEnum.OTHER:
        staffExist.gender = gender;
        break;
    }
    if (address) {
      staffExist.address = address;
      const ward = staffExist.ward;
      if (ward) {
        staffExist.fullAddress = `${address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
      } else {
        staffExist.fullAddress = 'Không xác định';
      }
    }

    if (birthDay) {
      const currentDate = moment().startOf('day').add(7, 'hour').toDate();
      const newBirthDay = moment(birthDay)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      if (newBirthDay >= currentDate) {
        throw new BadRequestException('BIRTHDAY_NOT_MORE_THAN_CURRENT_DATE');
      }
      staffExist.birthDay = newBirthDay;
    }

    if (wardCode) {
      if (wardCode !== staffExist.ward?.code) {
        const ward = await this.dataSource.getRepository(Ward).findOne({
          where: { code: wardCode },
          relations: { district: { province: true } },
        });
        if (ward) {
          staffExist.fullAddress = `${address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
        }
      }
    }

    staffExist.updatedBy = userId;
    const saveStaff = await this.adminRepository.save(staffExist);
    delete saveStaff.password;
    delete saveStaff.accessToken;
    delete saveStaff.refreshToken;
    delete saveStaff.otpCode;
    delete saveStaff.otpExpired;
    delete saveStaff.noteStatus;
    delete saveStaff.deletedAt;

    return saveStaff;
  }

  async updatePassword(id: string, dto: AdminUpdatePasswordDto) {
    const userExist = await this.findOneById(id, {
      select: {
        password: true,
      },
    });
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (!userExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!userExist.password) {
      throw new BadRequestException('GET_PASSWORD_FAILED');
    }
    if (!dto.oldPassword) {
      throw new BadRequestException('OLD_PASSWORD_REQUIRED');
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
    userExist.password = passwordHash;
    userExist.updatedBy = userExist.id;

    const saveUser = await this.adminRepository.save(userExist);
    delete saveUser.password;
    delete saveUser.accessToken;
    delete saveUser.refreshToken;
    delete saveUser.otpCode;
    delete saveUser.otpExpired;
    delete saveUser.noteStatus;
    delete saveUser.deletedAt;

    return saveUser;
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
    admin.updatedBy = admin.id;
    const saveUser = await this.adminRepository.save(admin);
    delete saveUser.password;
    delete saveUser.accessToken;
    delete saveUser.refreshToken;
    delete saveUser.otpCode;
    delete saveUser.otpExpired;
    delete saveUser.noteStatus;
    delete saveUser.deletedAt;

    return saveUser;
  }

  async updateActive(id: string) {
    const admin = await this.getAdminById(id);
    if (admin.isActive) {
      throw new BadRequestException('USER_ALREADY_ACTIVE');
    }
    admin.isActive = true;
    admin.otpCode = null;
    admin.otpExpired = null;
    admin.updatedBy = admin.id;
    const saveUser = await this.adminRepository.save(admin);
    delete saveUser.password;
    delete saveUser.accessToken;
    delete saveUser.refreshToken;
    delete saveUser.otpCode;
    delete saveUser.otpExpired;
    delete saveUser.noteStatus;
    delete saveUser.deletedAt;

    return saveUser;
  }

  async confirmAccount(dto: ConfirmAccountAdminDto) {
    const { phone, email, otp } = dto;
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
    let admin: Staff;
    if (phone) {
      admin = await this.findOneByPhone(phone, {
        select: { noteStatus: true },
      });
    } else if (email) {
      admin = await this.findOneByEmail(email, {
        select: { noteStatus: true },
      });
    }
    if (!admin) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (admin.noteStatus !== ActiveOtpTypeEnum.RESET_PASSWORD) {
      throw new BadRequestException('USER_NOT_RESET_PASSWORD');
    }

    if (newPassword !== confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    const passwordHash = await this.authService.hashData(newPassword);
    admin.password = passwordHash;
    admin.updatedBy = admin.id;
    admin.otpCode = null;
    admin.otpExpired = null;
    admin.refreshToken = null;
    admin.accessToken = null;
    const saveStaff = await this.adminRepository.save(admin);
    delete saveStaff.password;
    delete saveStaff.refreshToken;
    delete saveStaff.accessToken;
    delete saveStaff.otpCode;
    delete saveStaff.otpExpired;
    delete saveStaff.noteStatus;

    return saveStaff;
  }
}
