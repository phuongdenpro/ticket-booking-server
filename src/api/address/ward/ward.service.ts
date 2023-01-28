import { HiddenWardDto } from './dto/hidden-ward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Ward, District } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from 'src/decorator';
import { FilterWardDto } from './dto/filter-ward.dto';
import { SaveWardDto } from './dto';

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
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
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
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
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
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('w.code', 'ASC')
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
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('w.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async save(dto: SaveWardDto) {
    const district = await this.dataSource.getRepository(District).findOne({
      where: { code: dto.districtCode },
    });
    const ward = new Ward();
    ward.name = dto.name;
    ward.type = dto.type;
    ward.code = dto.code;
    ward.nameWithType = dto.nameWithType;
    ward.districtCode = dto.districtCode;
    ward.parentCode = district.id;

    return await this.wardRepository.save(ward);
  }

  // update a record by id
  async updateById(id: number, dto: SaveWardDto) {
    const query = this.wardRepository.createQueryBuilder('w');
    const district = await query
      .where('w.id = :id', { id })
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!district) return null;
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.nameWithType = dto.nameWithType;
    district.districtCode = dto.districtCode;

    return await this.wardRepository.save(district);
  }

  // update a record by code
  async updateByCode(code: number, dto: SaveWardDto) {
    const query = this.wardRepository.createQueryBuilder('w');
    const district = await query
      .where('w.code = :code', { code })
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!district) return null;
    district.name = dto.name;
    district.type = dto.type;
    district.code = code;
    district.nameWithType = dto.nameWithType;
    district.districtCode = dto.districtCode;

    return await this.wardRepository.save(district);
  }

  // delete a record by id
  async hiddenById(id: string, dto: HiddenWardDto) {
    const query = this.wardRepository.createQueryBuilder('w');
    const province = await query.where('w.id = :id', { id }).getOne();
    if (!province) return null;
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.wardRepository.save(province);
  }

  // delete a record by code
  async hiddenByCode(code: number, dto: HiddenWardDto) {
    const query = this.wardRepository.createQueryBuilder('w');
    const province = await query.where('w.code = :code', { code }).getOne();
    if (!province) return null;
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.wardRepository.save(province);
  }
}
