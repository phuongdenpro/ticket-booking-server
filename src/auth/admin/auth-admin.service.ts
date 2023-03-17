import { Staff } from '../../database/entities';
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
import { AdminLoginDto, AdminRegisterDto } from './dto';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async findOneAdmin(options?: any) {
    return await this.staffRepository.findOne({
      where: { ...options?.where },
      relations: [].concat(options?.relations || []),
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
        ...options?.select,
      },
      ...options?.other,
    });
  }

  async findOneById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneAdmin(options);
  }

  async findOneByRefreshToken(refreshToken: string, options?: any) {
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

  async findOneByEmail(email: string, options?: any) {
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }
    return await this.findOneAdmin(options);
  }

  async findOneByPhone(phone: string, options?: any) {
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }
    return await this.findOneAdmin(options);
  }

  async updateStaffByAdminId(staffId: string, data: any) {
    return this.staffRepository.update({ id: staffId }, data);
  }

  async register(userId: string, dto: AdminRegisterDto) {
    const { phone, email, name, gender } = dto;
    if (phone) {
      if (!phone.match(PHONE_REGEX)) {
        throw new BadRequestException('INVALID_PHONE_NUMBER');
      }
    }
    if (email && !email.match(EMAIL_REGEX)) {
      throw new BadRequestException('INVALID_EMAIL');
    }

    const staffPhoneExist = await this.findOneByPhone(phone);
    const staffEmailExist = await this.findOneByEmail(email);
    if (staffPhoneExist || staffEmailExist) {
      throw new BadRequestException('STAFF_ALREADY_EXIST');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const staffCred = new Staff();
      staffCred.password = passwordHashed;
      staffCred.fullName = name;
      staffCred.phone = phone;
      staffCred.email = email;
      staffCred.gender = gender;
      staffCred.createdBy = userId;

      const staff = await this.staffRepository.save(staffCred);
      delete staff.createdAt;
      delete staff.updatedAt;
      delete staff.deletedAt;
      delete staff.createdBy;
      delete staff.updatedBy;
      delete staff.password;

      await queryRunner.commitTransaction();

      return staff;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(dto: AdminLoginDto) {
    const { email, phone } = dto;
    if (!email && !phone) {
      throw new BadRequestException('EMAIL_OR_PHONE_REQUIRED');
    }
    let staffExist;
    if (email) {
      staffExist = await this.findOneByEmail(email, {
        select: {
          password: true,
        },
      });
    } else if (phone) {
      staffExist = await this.findOneByPhone(phone, {
        select: {
          password: true,
        },
      });
    }
    if (!staffExist) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }

    const isPasswordMatches = await this.authService.comparePassword(
      dto.password,
      staffExist.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const tokens = await this.authService.createTokens(
        staffExist,
        RoleEnum.STAFF,
      );

      await this.updateStaffByAdminId(staffExist.id, {
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

  async logout(staffId: any) {
    return await this.updateStaffByAdminId(staffId, {
      refreshToken: null,
      accessToken: null,
    });
  }

  async refreshToken(refreshToken: string) {
    const staffExist = await this.findOneByRefreshToken(refreshToken);
    if (!staffExist || !staffExist.refreshToken) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const tokens = await this.authService.createTokens(
      staffExist,
      RoleEnum.STAFF,
    );

    await this.updateStaffByAdminId(staffExist.id, {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
    });
    return tokens;
  }
}
