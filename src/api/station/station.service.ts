import { SortEnum } from './../../enums/sort.enum';
import { Ward } from './../../database/entities/vi-address-ward.entities';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ImageResource, Staff, Station } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/decorator';
import { FilterStationDto, SaveStationDto } from './dto';
import { ImageResourceService } from '../image-resource/image-resource.service';
import { StationDeleteInput } from './dto/delete-station.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    private imageResourceService: ImageResourceService,
    private dataSource: DataSource,
  ) {}

  async saveStation(dto: SaveStationDto, userId: string) {
    const { name, address, wardId, images } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    const station = new Station();
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.createdBy = adminExist.id;
    const newStation = await this.stationRepository.save(station);

    const newImages = await images.map(async (image) => {
      image.createdBy = adminExist.id;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        adminExist.id,
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
    const query = this.stationRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query
      .leftJoinAndSelect('q.ward', 'w')
      .select(['q', 'w.id', 'w.code'])
      .getOne();

    if (dataResult) {
      const queryImage = this.dataSource
        .getRepository(ImageResource)
        .createQueryBuilder('i');
      queryImage.where('i.station_id = :id', { id });
      const images = await queryImage
        .select(['i.id', 'i.url', 'i.updatedAt', 'i.createdAt'])
        .getMany();
      dataResult.images = images;
    }

    return { dataResult };
  }

  async findAll(dto: FilterStationDto, pagination?: Pagination) {
    const query = this.stationRepository.createQueryBuilder('r');
    if (dto?.keywords) {
      query
        .orWhere('r.name like :query')
        .orWhere('r.address like :query')
        .setParameter('query', `%${dto?.keywords}%`);
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .leftJoinAndSelect('r.ward', 'w')
      .select(['r', 'w.id', 'w.code'])
      .orderBy('r.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    if (dataResult) {
      // query image for each station
      const queryImage = this.dataSource
        .getRepository(ImageResource)
        .createQueryBuilder('i');
      const images = await queryImage
        .andWhere('i.station_id IN (:...ids)', {
          ids: dataResult.map((station) => station.id),
        })
        .leftJoinAndSelect('i.station', 's')
        .select(['i.id', 'i.url', 'i.updatedAt', 'i.createdAt', 's.id'])
        .getMany();

      // add image to station
      dataResult.forEach((station) => {
        station.images = images.filter(
          (image) => image.station.id === station.id,
        );
      });
    }

    return { dataResult, pagination, total };
  }

  async updateById(userId: string, id: string, dto: SaveStationDto) {
    const { name, address, wardId, images } = dto;
    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });

    const station = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException('Station not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.updatedBy = adminExist.id;

    const newStation = await this.stationRepository.save(station);

    const newImages = await images.map(async (image) => {
      image.createdBy = adminExist.id;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        adminExist.id,
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
  async hiddenById(userId: string, id: string) {
    const station = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException('Station not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    station.deletedAt = new Date();
    station.updatedBy = adminExist.id;

    return await this.stationRepository.save(station);
  }

  async deleteMultiple(userId: string, dto: StationDeleteInput) {
    try {
      const { ids } = dto;
      console.log(ids);
      
      const list = await Promise.all(
        ids.map(async (id) => {
          await this.hiddenById(userId, id);
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
