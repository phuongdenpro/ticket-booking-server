import { SaveDistrictDto } from './dto/save-district.dto';
import { FilterDistrictDto } from './dto/filter-district.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province } from 'src/database/entities';
import { Pagination } from 'src/decorator';
import { DataSource, Repository } from 'typeorm';
import { HiddenDistrictDto } from './dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.id = :id', { id });

    const dataResult = await query
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.code = :code', { code });

    const dataResult = await query
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findByProvinceCode(provinceCode: number, pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.provinceCode = :provinceCode', { provinceCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('d.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterDistrictDto, pagination?: Pagination) {
    const { name, type, codename: nameWithType, provinceCode } = dto;

    const query = this.districtRepository.createQueryBuilder('d');

    if (name) {
      query.andWhere('d.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('d.type like :type', { type: `%${type}%` });
    }
    if (nameWithType) {
      query.andWhere('d.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    }
    if (provinceCode) {
      query.andWhere('d.provinceCode = :provinceCode', { provinceCode });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('d.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async save(dto: SaveDistrictDto) {
    const province = await this.dataSource.getRepository(Province).findOne({
      where: { code: dto.provinceCode },
    });

    const district = new District();
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.codename = dto.nameWithType;
    district.provinceCode = dto.provinceCode;
    district.parentCode = province.id;

    return await this.districtRepository.save(district);
  }

  // update a record by id
  async updateById(id: string, dto: SaveDistrictDto) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query
      .where('d.id = :id', { id })
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!district) return null;
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.codename = dto.nameWithType;
    district.provinceCode = dto.provinceCode;

    return await this.districtRepository.save(district);
  }

  // update a record by code
  async updateByCode(code: number, dto: SaveDistrictDto) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query
      .where('d.code = :code', { code })
      .andWhere('d.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!district) return null;
    district.name = dto.name;
    district.type = dto.type;
    district.code = code;
    district.codename = dto.nameWithType;
    district.provinceCode = dto.provinceCode;

    return await this.districtRepository.save(district);
  }

  // delete a record by id
  async hiddenById(id: string, dto: HiddenDistrictDto) {
    const query = this.districtRepository.createQueryBuilder('d');
    const province = await query.where('d.id = :id', { id }).getOne();
    if (!province) return null;
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.districtRepository.save(province);
  }

  // delete a record by code
  async hiddenByCode(code: number, dto: HiddenDistrictDto) {
    const query = this.districtRepository.createQueryBuilder('d');
    const province = await query.where('d.code = :code', { code }).getOne();
    if (!province) {
      throw new BadRequestException('province not found');
    }
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.districtRepository.save(province);
  }
}
