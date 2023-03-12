import { SortEnum } from './../../enums';
import { AuthService } from './../../auth/auth.service';
import { AuthAdminService } from '../../auth/admin/auth-admin.service';
import { Staff } from './../../database/entities/staff.entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdminUpdatePasswordDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Staff)
    private readonly adminRepository: Repository<Staff>,
    private authAdminService: AuthAdminService,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async profile(adminId: string) {
    const staffExist = this.authAdminService.findOneById(adminId);
    if (!staffExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return staffExist;
  }

  async updatePassword(id: string, dto: AdminUpdatePasswordDto) {
    const userExist = await this.adminRepository.findOneById(id);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    const isPasswordMatches = await this.authService.comparePassword(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    // if (!isPasswordMatches) throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');

    const passwordHash = await this.authService.hashData(dto.newPassword);
    return await this.adminRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }

  async findOneBydId(id: string, options?: any) {
    return await this.adminRepository.findOne({
      where: { id, ...options?.where },
      select: {
        password: false,
        refreshToken: false,
        accessToken: false,
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }
}
