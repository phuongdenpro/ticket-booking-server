import { SaveProvinceDto } from './dto/save-province.dto';
import { Province } from 'src/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/decorator';
import { Repository } from 'typeorm';
import { FilterProvinceDto, HiddenProvinceDto } from './dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async findOneById(id: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.id = :id', { id });

    const dataResult = await query
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.code = :code', { code });

    const dataResult = await query
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  // find all
  async findAll(dto: FilterProvinceDto, pagination?: Pagination) {
    const { name, type, nameWithType } = dto;

    const query = this.provinceRepository.createQueryBuilder('p');

    if (name) {
      query.andWhere('p.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('p.type like :type', { type: `%${type}%` });
    }
    if (nameWithType) {
      query.andWhere('p.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('p.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // insert a new record
  async save(dto: SaveProvinceDto) {
    const province = new Province();
    province.name = dto.name;
    province.type = dto.type;
    province.code = dto.code;
    province.nameWithType = dto.nameWithType;

    return await this.provinceRepository.save(province);
  }

  // update a record by id
  async updateById(id: string, dto: SaveProvinceDto) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query
      .where('p.id = :id', { id })
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!province) return null;
    province.name = dto.name;
    province.type = dto.type;
    province.code = dto.code;
    province.nameWithType = dto.nameWithType;

    return await this.provinceRepository.save(province);
  }

  // update a record by code
  async updateByCode(code: number, dto: SaveProvinceDto) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query
      .where('p.code = :code', { code })
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    if (!province) return null;
    province.name = dto.name;
    province.type = dto.type;
    province.code = code;
    province.nameWithType = dto.nameWithType;

    return await this.provinceRepository.save(province);
  }

  // delete a record by id
  async hiddenById(id: string, dto: HiddenProvinceDto) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.id = :id', { id }).getOne();
    if (!province) return null;
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.provinceRepository.save(province);
  }

  // delete a record by code
  async hiddenByCode(code: number, dto: HiddenProvinceDto) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.code = :code', { code }).getOne();
    if (!province) return null;
    province.isDeleted = dto.status === 1 ? true : false;

    return await this.provinceRepository.save(province);
  }
}
