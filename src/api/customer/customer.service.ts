import { SortEnum, UserStatusEnum } from './../../enums';
import { CustomerUpdatePasswordDto } from './../../auth/customer/dto/update-password.dto';
import { AuthService } from './../../auth/auth.service';
import { Pagination } from '../../decorator';
import { Customer } from '../../database/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilterCustomerDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  private selectFields = [
    'u.id',
    'u.lastLogin',
    'u.status',
    'u.phone',
    'u.email',
    'u.fullName',
    'u.gender',
    'u.address',
    'u.note',
    'u.birthday',
    'u.createdAt',
    'u.updatedAt',
    'u.updatedBy',
  ];

  async findOneByEmail(email: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .select(this.selectFields)
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async findOneByRefreshToken(refreshToken: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.refreshToken = :refreshToken', { refreshToken })
      .select(this.selectFields)
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async findAll(dto: FilterCustomerDto, pagination: Pagination) {
    const { keywords, status } = dto;
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

    if (status) {
      query.andWhere('u.status = :status', { status });
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .orderBy('u.createdAt', SortEnum.DESC)
      .select(this.selectFields)
      .getMany();

    return { dataResult, pagination, total };
  }

  async findOneById(id: string) {
    const userExist = await this.customerRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .select(this.selectFields)
      .getOne();

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async updatePassword(id: string, dto: CustomerUpdatePasswordDto) {
    const userExist = await this.findOneById(id);
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
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
