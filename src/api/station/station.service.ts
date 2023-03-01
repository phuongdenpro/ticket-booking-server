import { SortEnum } from './../../enums/sort.enum';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ImageResource, Staff, Station, Ward } from './../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from './../../decorator';
import {
  FilterStationDto,
  SaveStationDto,
  UpdateStationDto,
  DeleteStationByIdsDto,
  DeleteStationByCodesDto,
} from './dto';
import { ImageResourceService } from '../image-resource/image-resource.service';
import { BadRequestException } from '@nestjs/common';
import * as excel from 'exceljs';
import { Response } from 'express';
import { Readable } from 'stream';
import { DistrictService } from '../address/district/district.service';
import { ProvinceService } from '../address/province/province.service';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    private imageResourceService: ImageResourceService,
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    private dataSource: DataSource,
  ) {}

  private selectFile = [
    'q',
    'w.id',
    'w.code',
    'w.name',
    'w.type',
    'w.codename',
    'w.districtCode',
  ];

  async saveStation(dto: SaveStationDto, userId: string) {
    const { name, address, wardId, images, code } = dto;

    const ward = await this.dataSource
      .getRepository(Ward)
      .findOne({ where: { code: wardId } });
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const oldStation = await this.stationRepository.findOne({
      where: { code },
    });
    if (oldStation) {
      throw new BadRequestException('STATION_CODE_EXISTED');
    }

    const station = new Station();
    station.name = name;
    station.address = address;
    station.ward = ward;
    station.code = code;
    station.createdBy = adminExist.id;
    const newStation = await this.stationRepository.save(station);

    const saveImages = await images.map(async (image) => {
      image.createdBy = adminExist.id;
      const saveImage = await this.imageResourceService.saveImageResource(
        image,
        adminExist.id,
        null,
        newStation.id,
      );
      delete saveImage.station;
      delete saveImage.createdBy;
      delete saveImage.updatedBy;
      delete saveImage.deletedAt;

      return saveImage;
    });
    newStation.images = await Promise.all(saveImages);
    return newStation;
  }

  async findOneStationById(id: string) {
    const query = this.stationRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query
      .leftJoinAndSelect('q.ward', 'w')
      .select(this.selectFile)
      .getOne();

    if (dataResult.ward.districtCode) {
      const district = await this.districtService.findOneByCode(
        dataResult.ward.districtCode,
      );
      dataResult['district'] = {
        id: district.dataResult.id,
        name: district.dataResult.name,
        type: district.dataResult.type,
        codename: district.dataResult.codename,
        code: district.dataResult.code,
      };

      const province = await this.provinceService.findOneByCode(
        district.dataResult.provinceCode,
      );
      dataResult['province'] = {
        id: province.dataResult.id,
        name: province.dataResult.name,
        type: province.dataResult.type,
        codename: province.dataResult.codename,
        code: province.dataResult.code,
      };
    }
    delete dataResult.ward.districtCode;

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

  async findOneStationByCode(code: string) {
    const query = this.stationRepository.createQueryBuilder('q');
    query.where('q.code = :code', { code });

    const dataResult = await query
      .leftJoinAndSelect('q.ward', 'w')
      .select(this.selectFile)
      .getOne();

    if (dataResult.ward.districtCode) {
      const district = await this.districtService.findOneByCode(
        dataResult.ward.districtCode,
      );
      dataResult['district'] = {
        id: district.dataResult.id,
        name: district.dataResult.name,
        type: district.dataResult.type,
        codename: district.dataResult.codename,
        code: district.dataResult.code,
      };

      const province = await this.provinceService.findOneByCode(
        district.dataResult.provinceCode,
      );
      dataResult['province'] = {
        id: province.dataResult.id,
        name: province.dataResult.name,
        type: province.dataResult.type,
        codename: province.dataResult.codename,
        code: province.dataResult.code,
      };
    }
    delete dataResult.ward.districtCode;

    if (dataResult) {
      const queryImage = this.dataSource
        .getRepository(ImageResource)
        .createQueryBuilder('i');
      queryImage.where('i.station_id = :id', { id: dataResult.id });
      const images = await queryImage
        .select(['i.id', 'i.url', 'i.updatedAt', 'i.createdAt'])
        .getMany();
      dataResult.images = images;
    }

    return { dataResult };
  }

  async findAll(dto: FilterStationDto, pagination?: Pagination) {
    const query = this.stationRepository.createQueryBuilder('q');
    const { keywords, sort } = dto;
    if (keywords) {
      query
        .orWhere('q.name like :query')
        .orWhere('q.address like :query')
        .orWhere('q.code like :query')
        .setParameter('query', `%${keywords}%`);
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const dataResult = await query
      .leftJoinAndSelect('q.ward', 'w')
      .select(this.selectFile)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    if (dataResult.length > 0) {
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

  async updateStationById(userId: string, id: string, dto: UpdateStationDto) {
    const { name, address, wardId, images, code } = dto;

    const station = await this.stationRepository.findOne({
      where: { id },
      relations: ['ward'],
    });
    if (!station) {
      throw new NotFoundException('STATION_NOT_FOUND');
    }

    if (code) {
      const oldStation = await this.stationRepository.findOne({
        where: { code },
      });
      if (oldStation) {
        throw new BadRequestException('STATION_CODE_EXISTED');
      }
      station.code = code;
    }
    if (name) {
      station.name = name;
    }
    if (wardId) {
      const ward = await this.dataSource
        .getRepository(Ward)
        .findOne({ where: { code: wardId } });
      station.ward = ward;
      delete station.ward.createdAt;
      delete station.ward.updatedAt;
      delete station.ward.createdBy;
      delete station.ward.updatedBy;
    }
    const districtDataResult = await this.districtService.findOneByCode(
      station.ward.districtCode,
    );
    const {
      createdAt: createdAtDistrict,
      updatedAt: updatedAtDistrict,
      createdBy: createdByDistrict,
      updatedBy: updatedByDistrict,
      ...district
    } = districtDataResult.dataResult;

    const provinceDataResult = await this.provinceService.findOneByCode(
      district.provinceCode,
    );
    const { createdAt, updatedAt, createdBy, updatedBy, ...province } =
      provinceDataResult.dataResult;
    if (address) {
      station.address = address;
    }
    station.fullAddress = `${station.address}, ${station.ward.name}, ${district.name}, ${province.name}`;
    station['district'] = district;
    station['province'] = province;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    station.updatedBy = adminExist.id;

    const newStation = await this.stationRepository.save(station);

    if (images && images.length > 0) {
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
    }
    return newStation;
  }

  async updateStationByCode(
    userId: string,
    currentCode: string,
    dto: UpdateStationDto,
  ) {
    const { name, address, wardId, images, code } = dto;

    const station = await this.stationRepository.findOne({
      where: { code: currentCode },
    });
    if (!station) {
      throw new NotFoundException('STATION_NOT_FOUND');
    }

    if (wardId) {
      const ward = await this.dataSource
        .getRepository(Ward)
        .findOne({ where: { code: wardId } });
      station.ward = ward;
      delete station.ward.createdAt;
      delete station.ward.updatedAt;
      delete station.ward.createdBy;
      delete station.ward.updatedBy;
    }
    if (code) {
      const oldStation = await this.stationRepository.findOne({
        where: { code },
      });
      if (oldStation) {
        throw new BadRequestException('STATION_CODE_EXISTED');
      }
      station.code = code;
    }
    if (name) {
      station.name = name;
    }
    const districtDataResult = await this.districtService.findOneByCode(
      station.ward.districtCode,
    );
    const {
      createdAt: createdAtDistrict,
      updatedAt: updatedAtDistrict,
      createdBy: createdByDistrict,
      updatedBy: updatedByDistrict,
      ...district
    } = districtDataResult.dataResult;

    const provinceDataResult = await this.provinceService.findOneByCode(
      district.provinceCode,
    );
    const { createdAt, updatedAt, createdBy, updatedBy, ...province } =
      provinceDataResult.dataResult;
    if (address) {
      station.address = address;
    }
    station.fullAddress = `${station.address}, ${station.ward.name}, ${district.name}, ${province.name}`;
    station['district'] = district;
    station['province'] = province;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    station.updatedBy = adminExist.id;

    const newStation = await this.stationRepository.save(station);

    if (images && images.length > 0) {
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
    }
    return newStation;
  }

  // delete a record by id
  async deleteStationById(userId: string, id: string) {
    const station = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException('STATION_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    station.deletedAt = new Date();
    station.updatedBy = adminExist.id;

    return await this.stationRepository.save(station);
  }

  // delete a record by code
  async deleteStationByCode(userId: string, code: string) {
    const station = await this.stationRepository.findOne({ where: { code } });

    if (!station) {
      throw new NotFoundException('STATION_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    station.deletedAt = new Date();
    station.updatedBy = adminExist.id;

    return await this.stationRepository.save(station);
  }

  async deleteMultipleStationByIds(userId: string, dto: DeleteStationByIdsDto) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => {
          await this.deleteStationById(userId, id);
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleStationByCodes(
    userId: string,
    dto: DeleteStationByCodesDto,
  ) {
    try {
      const { codes } = dto;

      const list = await Promise.all(
        codes.map(async (code) => {
          await this.deleteStationByCode(userId, code);
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async exportStation(dto: FilterStationDto, res: Response) {
    try {
      const query = this.stationRepository.createQueryBuilder('r');
      if (dto?.keywords) {
        query
          .orWhere('r.name like :query')
          .orWhere('r.address like :query')
          .setParameter('query', `%${dto?.keywords}%`);
      }

      const dataResult = await query
        .leftJoinAndSelect('r.ward', 'w')
        .select(['r', 'w.id', 'w.code'])
        .orderBy('r.createdAt', SortEnum.ASC)
        .getMany();

      // const total = await query.clone().getCount();

      if (dataResult.length > 0) {
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
      // create excel
      const workBook = new excel.Workbook();
      const workSheet = workBook.addWorksheet('Thông tin bến xe');
      const header = workSheet.addRow([
        'STT',
        'Mã bến xe',
        'Tên bến xe',
        'Địa chỉ bến xe',
        'Ngày tạo',
      ]);
      dataResult.map((item, index) => {
        workSheet.addRow([
          index + 1,
          item.id,
          item.name,
          item.address,
          item.createdAt,
        ]);
      });
      const buffer = await workBook.xlsx.writeBuffer();
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Length': buffer.byteLength,
      });
      stream.pipe(res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
