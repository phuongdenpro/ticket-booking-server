import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Ward } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from 'src/decorator';
import { FilterWardDto } from './dto/filter-ward.dto';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string, pagination?: Pagination) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.id = :id', { id });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async findOneByCode(code: number, pagination?: Pagination) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.code = :code', { code });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async findOneByDistrictCode(districtCode: number, pagination?: Pagination) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.districtCode = :districtCode', { districtCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterWardDto, pagination?: Pagination) {
    const { name, type, nameWithType, districtCode } = dto;

    const query = this.wardRepository.createQueryBuilder('w');

    if (name && !type && !nameWithType && !districtCode)
      query.where('w.name like :name', { name: `%${name}%` });
    if (!name && type && !nameWithType && !districtCode)
      query.where('w.type like :type', { type: `%${type}%` });
    if (!name && !type && nameWithType && !districtCode)
      query.where('w.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    if (!name && !type && !nameWithType && districtCode)
      query.where('w.districtCode = :districtCode', { districtCode });

    if (name && type && !nameWithType && !districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.type like :type', { type: `%${type}%` });
    if (name && !type && nameWithType && !districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (name && !type && !nameWithType && districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.districtCode = :districtCode', { districtCode });

    if (!name && type && nameWithType && !districtCode)
      query
        .where('w.type like :type', { type: `%${type}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (!name && type && !nameWithType && districtCode)
      query
        .where('w.type like :type', { type: `%${type}%` })
        .andWhere('w.districtCode = :districtCode', { districtCode });
    if (!name && !type && nameWithType && districtCode)
      query
        .where('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('w.districtCode = :districtCode', { districtCode });

    if (name && type && nameWithType && !districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.type like :type', { type: `%${type}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (name && type && !nameWithType && districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.type like :type', { type: `%${type}%` })
        .andWhere('w.districtCode = :districtCode', { districtCode });
    if (name && !type && nameWithType && districtCode)
      query
        .where('w.name like :name', { name: `%${name}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('w.districtCode = :districtCode', { districtCode });
    if (!name && type && nameWithType && districtCode)
      query
        .where('w.type like :type', { type: `%${type}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('w.districtCode = :districtCode', { districtCode });

    if (name && type && nameWithType && districtCode)
      query
        .andWhere('w.name like :name', { name: `%${name}%` })
        .andWhere('w.type like :type', { type: `%${type}%` })
        .andWhere('w.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('w.districtCode like :districtCode', { districtCode });

    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async create(ward: Ward) {
    return await this.wardRepository.save(ward);
  }
}
