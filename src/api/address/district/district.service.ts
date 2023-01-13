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

  async findAll(pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
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
