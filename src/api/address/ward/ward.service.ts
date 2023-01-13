import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Ward } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
    private dataSource: DataSource,
  ) {}

  async create(ward: Ward) {
    return await this.wardRepository.save(ward);
  }
}
