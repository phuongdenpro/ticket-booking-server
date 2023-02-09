import { Ward } from './../../database/entities/vi-address-ward.entities';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Station } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/decorator';
import { FilterStationDto, HiddenStationDto, SaveStationDto } from './dto';
import { ImageResourceService } from '../image-resource/image-resource.service';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationService: Repository<Station>,
    private imageResourceService: ImageResourceService,
    private dataSource: DataSource,
  ) {}

  async saveStation(dto: SaveStationDto, userId: string) {
    const { name, address, wardId, images } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });

    const station = new Station();
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.createdBy = userId;
    station.updatedBy = userId;
    // return station;
    const newStation = await this.stationService.save(station);

    const newImages = await images.map(async (image) => {
      image.createdBy = userId;
      image.updatedBy = userId;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        userId,
        null,
        newStation.id,
      );
      delete newImage.station;
      delete newImage.createdBy;
      delete newImage.updatedBy;
      delete newImage.deletedAt;
      delete newImage.isDeleted;

      return newImage;
    });
    newStation.images = await Promise.all(newImages);
    return newStation;
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
      .andWhere('i.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

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
      .andWhere('i.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('r.id', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateById(userId: string, id: string, dto: SaveStationDto) {
    const { name, address, wardId, images } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });

    const station = await this.stationService.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException('Station not found');
    }
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.updatedBy = userId;

    const newStation = await this.stationService.save(station);

    const newImages = await images.map(async (image) => {
      image.createdBy = userId;
      image.updatedBy = userId;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        userId,
        null,
        newStation.id,
      );
      delete newImage.station;
      delete newImage.createdBy;

      return newImage;
    });
    newStation.images = await Promise.all(newImages);
    return newStation;
  }

  // delete a record by id
  async hiddenById(userId: string, id: string, dto: HiddenStationDto) {
    const station = await this.stationService.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException('Station not found');
    }
    station.isDeleted = dto.status === 1 ? true : false;
    station.updatedBy = userId;

    return await this.stationService.save(station);
  }
}
