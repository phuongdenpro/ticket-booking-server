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

  async findOneById(id: string, options?: any) {
    return await this.customerRepository.findOne({
      where: { id },
      ...options,
    });
  }

  async findOneByEmail(email: string, options?: any) {
    return this.customerRepository.findOne({
      where: { email },
      ...options,
    });
  }

  async findOneByRefreshToken(refreshToken: string, options?: any) {
    return this.customerRepository.findOne({
      where: { refreshToken },
      ...options,
    });
  }

  async updateUserCredentialByUserId(userId: string, data: any) {
    return this.customerRepository.update({ id: userId }, data);
  }

  async findAll(dto: FilterCustomerDto, pagination: Pagination) {
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

  async updatePassword(id: string, dto: CustomerUpdatePasswordDto) {
    const userExist = await this.findOneById(id);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');

    const isPasswordMatches = await bcrypt.compare(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    // if (!isPasswordMatches) throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');

    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(),
    );
    return await this.customerRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }
}
