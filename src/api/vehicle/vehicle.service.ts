import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/database/entities';
import { LICENSE_PLATE_REGEX } from 'src/utils';
import { DataSource, Repository } from 'typeorm';
import { FilterVehicleDto, HiddenVehicleDto, SaveVehicleDto } from './dto';
import { ImageResourceService } from '../image-resource/image-resource.service';
import { Pagination } from 'src/decorator';
import { VehicleTypeEnum, VehicleSeatsEnum } from 'src/enums';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleService: Repository<Vehicle>,
    private imageResourceService: ImageResourceService,
    private dataSource: DataSource,
  ) {}

  async getVehicleTypes() {
    return {
      dataResult: Object.keys(VehicleTypeEnum).map((key) => ({
        key,
        value: VehicleTypeEnum[key],
        numOfSeats: VehicleSeatsEnum[key],
      })),
    };
  }

  async saveVehicle(dto: SaveVehicleDto, userId: string) {
    const {
      name,
      description,
      type,
      images,
      licensePlate,
      floorNumber,
      totalSeat,
    } = dto;
    const vehicle = new Vehicle();

    vehicle.name = name;
    vehicle.description = description;

    if (!type) {
      vehicle.type = VehicleTypeEnum.OTHER;
    } else {
      vehicle.type = type;
    }
    if (licensePlate.match(LICENSE_PLATE_REGEX)) {
      vehicle.licensePlate = licensePlate;
    } else {
      throw new BadRequestException('LICENSE_PLATE_INVALID');
    }
    if (floorNumber == 1 || floorNumber == 2) {
      vehicle.floorNumber = floorNumber;
    } else {
      throw new BadRequestException('FLOOR_NUMBER_INVALID');
    }

    vehicle.totalSeat = totalSeat;
    vehicle.createdBy = userId;
    vehicle.updatedBy = userId;

    const newVehicle = await this.vehicleService.save(vehicle);

    const newImages = await images.map(async (image) => {
      image.createdBy = userId;
      image.updatedBy = userId;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        userId,
        newVehicle.id,
      );
      delete newImage.vehicle;
      delete newImage.createdBy;
      delete newImage.updatedBy;
      delete newImage.deletedAt;
      delete newImage.isDeleted;

      return newImage;
    });
    newVehicle.images = await Promise.all(newImages);
    return newVehicle;
  }

  async findOneVehicleById(id: string) {
    const query = this.vehicleService.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query
      .leftJoinAndSelect('q.images', 'i')
      .select([
        'q',
        'i.id',
        'i.url',
        'i.createdAt',
        'i.updatedAt',
        'i.isDeleted',
      ])
      .andWhere('i.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    return { dataResult };
  }

  async findAll(dto: FilterVehicleDto, pagination?: Pagination) {
    const { name, type, licensePlate, floorNumber } = dto;
    const query = this.vehicleService.createQueryBuilder('q');

    if (name) {
      query.andWhere('q.name like :name', { name: `%${name}%` });
    }
    if (
      type == VehicleTypeEnum.LIMOUSINE ||
      type == VehicleTypeEnum.SLEEPER_BUS ||
      type == VehicleTypeEnum.SEAT_BUS ||
      type == VehicleTypeEnum.OTHER
    ) {
      query.andWhere('q.type = :type', { type });
    }
    if (licensePlate) {
      if (licensePlate.match(LICENSE_PLATE_REGEX)) {
        query.andWhere('q.licensePlate like :licensePlate', {
          licensePlate: `%${licensePlate}%`,
        });
      }
    }
    if (floorNumber == 1 || floorNumber == 2) {
      query.andWhere('q.floorNumber = :floorNumber', { floorNumber });
    }

    const total = await query.getCount();
    const dataResult = await query
      .leftJoinAndSelect('q.images', 'i')
      .select(['q', 'i.id', 'i.url', 'i.updatedAt', 'i.isDeleted'])
      .andWhere('i.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('q.createdAt', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateById(dto: SaveVehicleDto, userId: string, id: string) {
    const {
      name,
      description,
      licensePlate,
      type,
      floorNumber,
      totalSeat,
      images,
    } = dto;

    const vehicle = await this.vehicleService.findOne({ where: { id } });
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found');
    }
    vehicle.name = name;
    vehicle.description = description;
    vehicle.licensePlate = licensePlate;
    vehicle.type = type;
    vehicle.floorNumber = floorNumber;
    vehicle.totalSeat = totalSeat;
    vehicle.updatedBy = userId;

    const updateVehicle = await this.vehicleService.save(vehicle);

    const newImages = await images.map(async (image) => {
      image.createdBy = userId;
      image.updatedBy = userId;
      const newImage = await this.imageResourceService.saveImageResource(
        image,
        userId,
        updateVehicle.id,
      );
      delete newImage.vehicle;
      delete newImage.createdBy;
      delete newImage.updatedBy;
      delete newImage.deletedAt;
      delete newImage.isDeleted;

      return newImage;
    });
    updateVehicle.images = await Promise.all(newImages);
    return updateVehicle;
  }

  async hiddenById(dto: HiddenVehicleDto, userId: string, id: string) {
    const hiddenVehicle = await this.vehicleService.findOne({ where: { id } });
    if (!hiddenVehicle) {
      throw new BadRequestException('Vehicle not found');
    }
    const { status } = dto;
    hiddenVehicle.isDeleted = status === 1 ? true : false;
    hiddenVehicle.updatedBy = userId;

    const updateVehicle = await this.vehicleService.save(hiddenVehicle);
    return updateVehicle;
  }
}
