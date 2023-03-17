import { SortEnum, UserStatusEnum } from './../../enums';
import { Pagination } from '../../decorator';
import { Customer, CustomerGroup, Staff } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilterCustomerDto } from './dto';
import { UserUpdatePasswordDto } from '../user/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
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
    'cg.id',
    'cg.name',
    'cg.code',
    'cg.description',
    'cg.note',
    'cg.createdBy',
    'cg.createdAt',
    'cg.updatedAt',
  ];

  async findOneCustomer(options: any) {
    return await this.customerRepository.findOne({
      where: { ...options?.where },
      select: {
        id: true,
        lastLogin: true,
        status: true,
        phone: true,
        email: true,
        fullName: true,
        gender: true,
        address: true,
        fullAddress: true,
        note: true,
        birthday: true,
        createdAt: true,
        updatedBy: true,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options?.other,
    });
  }

  async findOneByEmail(email: string, options?: any) {
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }
    return await this.findOneCustomer(options);
  }

  async findOneByPhone(phone: string, options?: any) {
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }
    return await this.findOneCustomer(options);
  }

  async findOneById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneCustomer(options);
  }

  async findCustomerByRefreshToken(refreshToken: string, options?: any) {
    if (options) {
      options.where = { refreshToken, ...options?.where };
      options.select = { refreshToken: true, ...options?.select };
    } else {
      options = { where: { refreshToken }, select: { refreshToken: true } };
    }
    return await this.findOneCustomer(options);
  }

  async findAll(dto: FilterCustomerDto, pagination: Pagination) {
    const { keywords, status } = dto;
    const query = this.customerRepository.createQueryBuilder('u');
    if (keywords) {
      query
        .orWhere('u.fullName like :query')
        .orWhere('u.email like :query')
        .orWhere('u.phone like :query')
        .orWhere('u.address like :query')
        .orWhere('u.note like :query')
        .setParameter('query', `%${keywords}%`);
    }

    if (status) {
      query.andWhere('u.status = :status', { status });
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .leftJoinAndSelect('u.customerGroup', 'cg')
      .offset(pagination.skip)
      .limit(pagination.take)
      .orderBy('u.createdAt', SortEnum.DESC)
      .select(this.selectFieldsWithQ)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getCustomerByEmail(email: string, options?: any) {
    const userExist = await this.findOneByEmail(email, options);

    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async getCustomerById(id: string, options?: any) {
    const userExist = await this.findOneById(id, options);

    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.getCustomerById(id);
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

  async addCustomerToCustomerGroup(
    customerId: string,
    groupId: string,
    adminId: string,
  ) {
    const customer = await this.getCustomerById(customerId);
    const customerGroup = await this.dataSource
      .getRepository(CustomerGroup)
      .findOne({
        where: { id: groupId },
      });
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customer.customerGroup = customerGroup;
    customer.updatedBy = adminExist.id;
    return await this.customerRepository.save(customer);
  }

  async removeCustomerFromCustomerGroup(
    customerId: string,
    groupId: string,
    adminId: string,
  ) {
    const customer = await this.getCustomerById(customerId);
    const customerGroup = await this.dataSource
      .getRepository(CustomerGroup)
      .findOne({
        where: { id: groupId },
      });
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    customer.customerGroup = null;
    customer.updatedBy = adminExist.id;
    return await this.customerRepository.save(customer);
  }

  async getCustomerStatus() {
    return Object.keys(UserStatusEnum).map((key) => UserStatusEnum[key]);
  }
}
