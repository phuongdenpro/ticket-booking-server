import { Province } from 'src/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/decorator';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  // find all
  async findAll(pagination?: Pagination) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const total = await query.clone().getCount();

    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // insert a new record
  async create(province: Province) {
    return await this.provinceRepository.save(province);
  }
}
