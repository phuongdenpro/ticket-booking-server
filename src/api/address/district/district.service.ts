import { FilterDistrictDto } from './dto/filter-district.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/database/entities';
import { Pagination } from 'src/decorator';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string, pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.id = :id', { id });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async findOneByCode(code: number, pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.code = :code', { code });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async findOneByProvinceCode(provinceCode: number, pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.provinceCode = :provinceCode', { provinceCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterDistrictDto, pagination?: Pagination) {
    const { name, type, nameWithType, provinceCode } = dto;

    const query = this.districtRepository.createQueryBuilder('d');

    if (name && !type && !nameWithType && !provinceCode)
      query.where('d.name like :name', { name: `%${name}%` });
    if (!name && type && !nameWithType && !provinceCode)
      query.where('d.type like :type', { type: `%${type}%` });
    if (!name && !type && nameWithType && !provinceCode)
      query.where('d.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    if (!name && !type && !nameWithType && provinceCode)
      query.where('d.provinceCode = :provinceCode', { provinceCode });

    if (name && type && !nameWithType && !provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.type like :type', { type: `%${type}%` });
    if (name && !type && nameWithType && !provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (name && !type && !nameWithType && provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });

    if (!name && type && nameWithType && !provinceCode)
      query
        .where('d.type like :type', { type: `%${type}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (!name && type && !nameWithType && provinceCode)
      query
        .where('d.type like :type', { type: `%${type}%` })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });
    if (!name && !type && nameWithType && provinceCode)
      query
        .where('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });

    if (name && type && nameWithType && !provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.type like :type', { type: `%${type}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        });
    if (name && type && !nameWithType && provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.type like :type', { type: `%${type}%` })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });
    if (name && !type && nameWithType && provinceCode)
      query
        .where('d.name like :name', { name: `%${name}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });
    if (!name && type && nameWithType && provinceCode)
      query
        .where('d.type like :type', { type: `%${type}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('d.provinceCode = :provinceCode', { provinceCode });

    if (name && type && nameWithType && provinceCode)
      query
        .andWhere('d.name like :name', { name: `%${name}%` })
        .andWhere('d.type like :type', { type: `%${type}%` })
        .andWhere('d.name_with_type like :name_with_type', {
          name_with_type: `%${nameWithType}%`,
        })
        .andWhere('d.provinceCode like :provinceCode', { provinceCode });

    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async create(district: District) {
    return await this.districtRepository.save(district);
  }
}
