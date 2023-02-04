import { HiddenStationDto } from './dto/hidden-station.dto';
import { FilterStationDto } from './dto/filter-station.dto';
import { Ward } from './../../database/entities/vi-address-ward.entities';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Station } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveStationDto } from './dto/save-station.dto';
import { Pagination } from 'src/decorator';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationService: Repository<Station>,
    private dataSource: DataSource,
  ) {}

  async save(dto: SaveStationDto, userId: string) {
    const { name, address, wardId } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });

    const station = new Station();
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.createdBy = userId;
    station.updatedBy = userId;

    return await this.stationService.save(station);
  }

  async findOneById(id: string) {
    const query = this.stationService.createQueryBuilder('r');
    query.where('r.id = :id', { id });

    const dataResult = await query
      .leftJoinAndSelect('r.ward', 'w')
      .leftJoinAndSelect('r.images', 'i')
      .select([
        'r',
        'w.id',
        'w.code',
        'i.id',
        'i.url',
        'i.updatedAt',
        'i.isDeleted',
      ])
      .andWhere('r.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    // const images = this.dataSource
    //   .getRepository(ImageResource)
    //   .createQueryBuilder('a')
    //   .where('a.station_id = :id', { id })
    //   .select(['a.id', 'a.url', 'a.isDeleted', 'a.createdAt', 'a.updatedAt'])
    //   .getMany();
    // dataResult.images = await images;

    return { dataResult };
  }

  async findAll(dto: FilterStationDto, pagination?: Pagination) {
    const { name, address, wardId } = dto;
    const query = this.stationService.createQueryBuilder('r');

    if (name) {
      query.andWhere('r.name like :name', { name: `%${name}%` });
    }
    if (address) {
      query.andWhere('r.address like :address', { address: `%${address}%` });
    }
    if (wardId) {
      query.andWhere('r.ward_id = :wardId', { wardId });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .leftJoinAndSelect('r.ward', 'w')
      .leftJoinAndSelect('r.images', 'i')
      .select([
        'r',
        'w.id',
        'w.code',
        'i.id',
        'i.url',
        'i.updatedAt',
        'i.isDeleted',
      ])
      .andWhere('r.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('r.id', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateById(userId: string, id: string, dto: SaveStationDto) {
    const { name, address, wardId } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });

    const station = await this.stationService.findOne({ where: { id } });

    if (!station) return null;
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.updatedBy = userId;

    return await this.stationService.save(station);
  }

  // delete a record by id
  async hiddenById(userId: string, id: string, dto: HiddenStationDto) {
    const station = await this.stationService.findOne({ where: { id } });

    if (!station) return null;
    station.isDeleted = dto.status === 1 ? true : false;
    station.updatedBy = userId;

    return await this.stationService.save(station);
  }
}
