import { AdminUser, AdminUserCredential } from 'src/database/entities';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/enums';
import { EMAIL_REGEX, PHONE_REGEX, USERNAME_REGEX } from 'src/utils/regex.util';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { AdminLoginDto, AdminRegisterDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser) private adminRepository: Repository<AdminUser>,
    @InjectRepository(AdminUserCredential)
    private adminCredentialsRRepository: Repository<AdminUserCredential>,
    private authService: AuthService,
    private dataSource: DataSource
  ) {}

  async findOneById(id: string, options?: any) {
    return this.adminRepository.findOne({ where: { id }, ...options });
  }

  async findOneByUsername(username: string, options?: any) {
    return this.adminRepository.findOne({
      where: { username: username.toLowerCase() },
      ...options,
    });
  }

  async updateAdminCredentialByAdminId(adminId: string, data: any) {
    return this.adminCredentialsRRepository.update({ adminUser: { id: adminId } }, data);
  }

  async register(userId: string, dto: AdminRegisterDto) {
    if (!dto.username.match(USERNAME_REGEX))
      throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    if (!dto.phone.match(PHONE_REGEX)) throw new BadRequestException('INVALID_PHONE_NUMBER');
    if (dto.email && !dto.email.match(EMAIL_REGEX)) throw new BadRequestException('INVALID_EMAIL');

    const adminExist = await this.findOneByUsername(dto.username);
    if (adminExist) throw new BadRequestException('USERNAME_ALREADY_EXIST');

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHashed = await this.authService.hashData(dto.password);

      const adminCred = new AdminUserCredential();
      adminCred.password = passwordHashed;
      await this.adminCredentialsRRepository.save(adminCred);

      const admin = new AdminUser();
      admin.username = dto.username.toLowerCase();
      admin.name = dto.name;
      admin.phone = dto.phone;
      admin.email = dto.email;
      admin.gender = dto.gender;
      admin.adminUserCredential = adminCred;
      const adminCreated = await this.adminRepository.save(admin);

      await queryRunner.commitTransaction();
      delete admin.adminUserCredential;
      delete admin.createdAt;
      delete admin.updatedAt;
      delete admin.deletedAt;
      return adminCreated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }
  async profile(id: string) {
    const adminExist = this.findOneById(id);
    if (!adminExist) throw new BadRequestException('USER_NOT_FOUND');
    return adminExist;
  }
  async login(dto: AdminLoginDto) {
    const adminExist = await this.findOneByUsername(dto.username, {
      relations: ['adminUserCredential'],
    });
    if (!adminExist) throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');

    const isPasswordMatches = await this.authService.comparePassword(
      dto.password,
      adminExist.adminUserCredential.password
    );
    if (!isPasswordMatches) throw new BadRequestException('INVALID_USERNAME_OR_PASSWORD');
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const tokens = await this.authService.createTokens(adminExist, RoleEnum.ADMIN);
      await this.updateAdminCredentialByAdminId(adminExist.id, {
        ...tokens,
      });

      await queryRunner.commitTransaction();
      console.log(adminExist);
      return tokens;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async logout(adminId: any) {
    return await this.updateAdminCredentialByAdminId(adminId, {
      refresh_token: null,
      access_token: null,
    });
  }

  async refreshTokens(adminId: any) {
    const adminExist = await this.findOneById(adminId, { relations: ['adminUserCredential'] });
    if (!adminExist || !adminExist.adminUserCredential.refresh_token)
      throw new UnauthorizedException();

    const tokens = await this.authService.createTokens(adminExist, RoleEnum.ADMIN);

    await this.updateAdminCredentialByAdminId(adminExist.id, {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
    });

    console.log(adminExist);
    return tokens;
  }
}
