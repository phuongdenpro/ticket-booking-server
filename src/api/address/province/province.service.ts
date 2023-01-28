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

  async findOneById(id: string, pagination?: Pagination) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.id = :id', { id });

    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async findOneByCode(code: number, pagination?: Pagination) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.code = :code', { code });

    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('p.isDeleted = :isDeleted', { isDeleted: false })
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterProvinceDto, pagination?: Pagination) {
    const { name, type, name_with_type } = dto;

    const query = this.provinceRepository.createQueryBuilder('p');

    if (name || type || name_with_type) {
      if (name && !type && !name_with_type)
        query.where('p.name like :name', { name: `%${name}%` });

      if (!name && type && !name_with_type)
        query.where('p.type like :type', { type: `%${type}%` });

      if (!name && !type && name_with_type)
        query.where('p.name_with_type like :name_with_type', {
          name_with_type: `%${name_with_type}%`,
        });

      if (name && type && !name_with_type)
        query
          .where('p.name like :name', { name: `%${name}%` })
          .andWhere('p.type like :type', { type: `%${type}%` });

      if (name && !type && name_with_type)
        query
          .where('p.name like :name', { name: `%${name}%` })
          .andWhere('p.name_with_type like :name_with_type', {
            name_with_type: `%${name_with_type}%`,
          });

      if (!name && type && name_with_type)
        query
          .where('p.type like :type', { type: `%${type}%` })
          .andWhere('p.name_with_type like :name_with_type', {
            name_with_type: `%${name_with_type}%`,
          });

      if (name && type && name_with_type)
        query
          .andWhere('p.name like :name', { name: `%${name}%` })
          .andWhere('p.type like :type', { type: `%${type}%` })
          .andWhere('p.name_with_type like :name_with_type', {
            name_with_type: `%${name_with_type}%`,
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
