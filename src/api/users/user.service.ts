import { Pagination } from './../../decorator';
import { Customer } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatusEnum, GenderEnum } from './../../enums';
import { EMAIL_REGEX, PHONE_REGEX } from './../../utils/regex.util';
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
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  async findOneById(userId: string, options?: any) {
    return await this.customerRepository.findOne({
      where: { id: userId },
      ...options,
    });
  }

  async findAll(dto: FilterUserDto, pagination: Pagination) {
    const { keywords } = dto;
    const query = this.customerRepository.createQueryBuilder('u');
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

    return { dataResult, pagination, total };
  }

  async findOne(id: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }
}
