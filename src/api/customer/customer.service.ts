import { SortEnum, UserStatusEnum } from './../../enums';
import { Pagination } from '../../decorator';
import { Customer } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilterCustomerDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserUpdatePasswordDto } from '../user/dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  private selectFieldsWithQ = [
    'u.id',
    'u.lastLogin',
    'u.status',
    'u.phone',
    'u.email',
    'u.fullName',
    'u.gender',
    'u.address',
    'u.fullAddress',
    'u.note',
    'u.birthday',
    'u.createdAt',
    'u.updatedAt',
    'u.updatedBy',
  ];

  private selectFields = [
    'id',
    'lastLogin',
    'status',
    'phone',
    'email',
    'fullName',
    'gender',
    'address',
    'fullAddress',
    'note',
    'birthday',
    'createdAt',
    'updatedAt',
    'updatedBy',
  ];

  async findOneByEmail(email: string, options?: any) {
    return await this.customerRepository.findOne({
      where: { email, ...options?.where },
      select: {
        deletedAt: false,
        password: false,
        refreshToken: false,
        accessToken: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOneByPhone(phone: string, options?: any) {
    return await this.customerRepository.findOne({
      where: { phone, ...options?.where },
      select: {
        deletedAt: false,
        password: false,
        refreshToken: false,
        accessToken: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOneById(id: string, options?: any) {
    return await this.customerRepository.findOne({
      where: { id, ...options?.where },
      select: {
        deletedAt: false,
        password: false,
        refreshToken: false,
        accessToken: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async getCustomerByEmail(email: string, options?: any) {
    const userExist = await this.findOneByEmail(email, {
      select: this.selectFields,
      ...options,
    });

    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async findCustomerByRefreshToken(refreshToken: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.refreshToken = :refreshToken', { refreshToken })
      .select(this.selectFieldsWithQ)
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async findAll(dto: FilterCustomerDto, pagination: Pagination) {
    const { keywords, status } = dto;
    const query = this.customerRepository.createQueryBuilder('u');
    if (keywords) {
      query
        .orWhere('u.fullName like :query')
        .orWhere('u.phone like :query')
        .orWhere('u.email like :query')
        .orWhere('u.address like :query')
        .orWhere('u.note like :query')
        .setParameter('query', `%${keywords}%`);
    }

    if (status) {
      query.andWhere('u.status = :status', { status });
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .orderBy('u.createdAt', SortEnum.DESC)
      .select(this.selectFieldsWithQ)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getCustomerById(id: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .select(this.selectFieldsWithQ)
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.getCustomerById(id);
    if (!userExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (userExist.status == 0) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const isPasswordMatches = await bcrypt.compare(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    }
    if (dto?.newPassword !== dto?.confirmNewPassword) {
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    }

    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(),
    );
    return await this.customerRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }

  async getCustomerStatus() {
    return Object.keys(UserStatusEnum).map((key) => UserStatusEnum[key]);
  }
}
