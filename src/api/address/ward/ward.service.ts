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

  async findOneById(id: string) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.id = :id', { id });

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.code = :code', { code });

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findByDistrictCode(districtCode: number, pagination?: Pagination) {
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
    const { name, type, codename: nameWithType, districtCode } = dto;

    const query = this.wardRepository.createQueryBuilder('w');

    if (name) {
      query.andWhere('w.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('w.type like :type', { type: `%${type}%` });
    }
    if (nameWithType) {
      query.andWhere('w.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    }
    if (districtCode) {
      query.andWhere('w.districtCode = :districtCode', { districtCode });
    }

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
    ward.codename = dto.codename;
    ward.districtCode = dto.districtCode;
    ward.parentCode = district.id;

    return await this.wardRepository.save(ward);
  }

  // update a record by id
  async updateById(id: number, dto: SaveWardDto) {
    const district = await this.wardRepository.findOne({ where: { id } });

    if (!district) return null;
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.codename = dto.codename;
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
    district.codename = dto.codename;
    district.districtCode = dto.districtCode;

    return await this.wardRepository.save(district);
  }

  // delete a record by id
  async hiddenById(id: number, dto: HiddenWardDto) {
    const province = await this.wardRepository.findOne({ where: { id } });
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
