import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/database/entities';
import { VehicleType } from 'src/enums/vehicle-type.enum';
import { IMAGE_FILES_REGEX, LICENSE_PLATE_REGEX } from 'src/utils';
import { DataSource, Repository } from 'typeorm';
import {
  FilterVehicleDto,
  HiddenVehicleDto,
  SaveVehicleDto,
  UpdateVehicleDto,
} from './dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleService: Repository<Vehicle>,
    private dataSource: DataSource,
  ) {}

  // upload  here
  async create(dto: SaveVehicleDto, userId: string) {
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
      vehicle.type = VehicleType.OTHER;
    } else {
      throw new BadRequestException('TYPE_INVALID');
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
    if (images[0].match(IMAGE_FILES_REGEX)) {
      // vehicle.images = images;
    } else {
      throw new BadRequestException('IMAGE_INVALID');
    }

    vehicle.totalSeat = totalSeat;
    vehicle.createdBy = userId;
    vehicle.updatedBy = userId;

    return await this.vehicleService.save(vehicle);
  }

  async findOneById(id: string) {}

  async findByTypeAll(dto: FilterVehicleDto) {}

  async updateById(dto: UpdateVehicleDto, userId: string) {}

  async hiddenById(dto: HiddenVehicleDto, userId: string) {}
}
