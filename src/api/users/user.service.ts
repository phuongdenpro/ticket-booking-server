import { Pagination } from 'src/decorator';
import {
  AdminUser,
  User,
  UserCredential,
} from 'src/database/entities';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatusEnum } from 'src/enums';
// import { mappingTranslate } from '@src/libs/utils/translate.util';
import { GenderEnum } from 'src/enums';
import { EMAIL_REGEX, PHONE_REGEX } from 'src/utils/regex.util';
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { DataSource, Repository } from 'typeorm';

import {
  CountUserDto,
  CreateUserDto,
  FilterUserDto,
  UpdatePasswordDto,
  UpdateStatusUserDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(AdminUser) private readonly adminRepository: Repository<AdminUser>,
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
    private dataSource: DataSource
  ) {}

  async findOneById(userId: string, options?: any) {
    return await this.userRepository.findOne({
      where: { id: userId },
      ...options,
    });
  }


  async findAll(dto: FilterUserDto, pagination: Pagination) {
    const {
      keywords,
    } = dto;
    const breadcrumb = [];
    const query = this.userRepository
      .createQueryBuilder('u')
    if (keywords) {
      query
        .orWhere('u.username like :query')
        .orWhere('u.name like :query')
        .orWhere('u.phone like :query')
        .orWhere('u.email like :query')
        .orWhere("LPAD(u.code::text, 8, '0') like :query")
        .setParameter('query', `%${keywords}%`);
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .orderBy('u.updatedAt', 'DESC')
      .getMany();

    // const dataResult = {
    //   breadcrumb,
    //   data,
    // };
    return { dataResult, pagination, total };
  }

  async findOne(id: string) {
    const userExist = await this.userRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async updateStatus(userId: string, dto: UpdateStatusUserDto) {
    const userExist = await this.findOneById(userId);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return await this.userRepository.update({ id: userId }, { status: dto.status });
  }

  async update(adminId: string, userId: string, dto: UpdateUserDto) {
    const {  ...userUpdate } = dto;

    const adminExist = await this.dataSource.manager.findOne(AdminUser, { where: { id: adminId } });
    if (!adminExist) throw new UnauthorizedException();

    if (dto?.phone && !dto.phone.match(PHONE_REGEX))
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    if (dto?.email && !dto.email.match(EMAIL_REGEX)) throw new BadRequestException('INVALID_EMAIL');
    if (dto?.birthDate) {
      if (moment().diff(moment(dto.birthDate), 'y') <= 5)
        throw new BadRequestException('INVALID_BIRTHDATE');
    }

    const userExist = await this.findOneById(userId, { relations: ['profile'] });
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    if (userUpdate?.username) {
      console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 userUpdate?.username: ', userUpdate?.username);
      if (userUpdate.username !== userExist.username) {
        const userNameExist = await this.userRepository.findOne({
          where: { username: userUpdate.username },
        });
        if (userNameExist) throw new BadRequestException('USERNAME_ALREADY_EXIST');
      }
    }

    if (dto?.status) {
      userExist.status = dto.status;
    }


    const queryRunner = await this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const queryManager = queryRunner.manager;
      await queryManager.getRepository(User).update(
        { id: userId },
        {
          username: userUpdate?.username ? userUpdate.username : userExist.username,
          birthDate: userUpdate?.birthDate ? userUpdate.birthDate : userExist.birthDate,
          email: userUpdate?.email ? userUpdate.email : userExist.email,
          gender: userUpdate?.gender ? userUpdate.gender : userExist.gender,
          name: userUpdate?.name ? userUpdate.name : userExist.name,
          phone: userUpdate?.phone ? userUpdate.phone : userExist.phone,
          // point: userUpdate?.point ? userUpdate.point : userExist.point
          status: userUpdate?.status ? userUpdate.status : userExist.status,
          updatedBy: adminExist.id,
        }
      );
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updatePassword(adminId: string, userId: string, dto: UpdatePasswordDto) {
    const adminExist = await this.dataSource.manager.findOne(AdminUser, { where: { id: adminId } });
    if (!adminExist) throw new UnauthorizedException();

    const userExist = await this.findOneById(userId, { relation: ['userCredential'] });
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    // const isPasswordMatches = await bcrypt.compare(
    //   dto.oldPassword,
    //   userExist.userCredential.password
    // );
    // if (!isPasswordMatches) throw new BadRequestException('OLD_PASSWORD_MISMATCH');

    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');

    const passwordHash = await bcrypt.hash(dto.newPassword, await bcrypt.genSalt());
    return await this.userCredentialRepository.update(
      { user: userExist },
      { password: passwordHash, updatedBy: adminExist.id }
    );
  }

  async create(adminId: string, dto: CreateUserDto) {
    const adminExist = await this.dataSource.manager.findOne(AdminUser, { where: { id: adminId } });
    if (!adminExist) throw new UnauthorizedException();

    const user = new User();


    if (dto?.email) {
      if (!dto?.email.match(EMAIL_REGEX)) throw new BadRequestException('INVALID_EMAIL');
      user.email = dto.email;
    }

    if (dto?.phone) {
      if (!dto?.phone.match(PHONE_REGEX)) throw new BadRequestException('INVALID_PHONE_NUMBER');
      user.phone = dto.phone;
    }

    if (dto?.birthDate) {
      if (moment().diff(moment(dto.birthDate), 'y') <= 5)
        throw new BadRequestException('INVALID_BIRTHDATE');
      user.birthDate = dto.birthDate;
    }
    if (dto.status !== UserStatusEnum.INACTIVATE) {
      user.status = dto.status;
    }

    const userExist = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (userExist) throw new BadRequestException('USERNAME_ALREADY_EXIST');

    const queryRunner = await this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const queryManager = await queryRunner.manager;

      const userCred = new UserCredential();
      userCred.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());

      await queryManager.save(userCred);

      user.username = dto.username;
      user.name = dto.name;
      user.phone = dto.phone;
      user.createdBy = adminExist.id;
      user.userCredential = userCred;

      const userCreated = await queryManager.save(user);

      await queryRunner.commitTransaction();
      return userCreated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err.message);
    } finally {
      await queryRunner.release();
    }
  }

}
