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
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string, options?: any) {
    return this.staffRepository.findOne({ where: { id }, ...options });
  }

  async findOneByRefreshToken(refreshToken: string, options?: any) {
    return this.staffRepository.findOne({
      where: { refreshToken },
      ...options,
    });
  }

  async findOneByEmail(email: string, options?: any) {
    return this.staffRepository.findOne({
      where: { email: email.toLowerCase() },
      ...options,
    });
  }

  async updateStaffByAdminId(staffId: string, data: any) {
    return this.staffRepository.update({ id: staffId }, data);
  }

  async register(userId: string, dto: AdminRegisterDto) {
    // if (!dto.username.match(USERNAME_REGEX))
    //   throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    if (dto.phone) {
      if (!dto.phone.match(PHONE_REGEX)) {
        throw new BadRequestException('INVALID_PHONE_NUMBER');
      }
    }
    if (dto.email && !dto.email.match(EMAIL_REGEX)) {
      throw new BadRequestException('INVALID_EMAIL');
    }

    const staffExist = await this.findOneByEmail(dto.email);
    if (staffExist) {
      throw new BadRequestException('STAFF_ALREADY_EXIST');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const staffCred = new Staff();
      staffCred.password = passwordHashed;
      staffCred.fullName = dto.name;
      staffCred.phone = dto.phone;
      staffCred.email = dto.email;
      staffCred.gender = dto.gender;
      staffCred.createdBy = userId;
      staffCred.updatedBy = userId;
      const staffCreated = await this.staffRepository.save(staffCred);

      await queryRunner.commitTransaction();
      const {
        createdAt,
        updatedAt,
        deletedAt,
        createdBy,
        updatedBy,
        password,
        ...staff
      } = staffCreated;

      return staff;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async profile(id: string) {
    const staffExist = this.findOneById(id);
    if (!staffExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return staffExist;
  }

  async login(dto: AdminLoginDto) {
    const staffExist = await this.findOneByEmail(dto.email);
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
    console.log(staffExist);

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
