import { CreateSeatDto } from './../seat/dto';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageResource, Staff, Vehicle } from './../../database/entities';
import { LICENSE_PLATE_REGEX } from './../../utils';
import { DataSource, Repository } from 'typeorm';
import {
  FilterVehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleDeleteMultiInput,
} from './dto';
import { ImageResourceService } from '../image-resource/image-resource.service';
import { Pagination } from './../../decorator';
import {
  VehicleTypeEnum,
  VehicleSeatsEnum,
  SeatTypeEnum,
  SortEnum,
} from './../../enums';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleService: Repository<Vehicle>,
    private imageResourceService: ImageResourceService,
    private seatService: SeatService,
    private dataSource: DataSource,
  ) {}

  async findOneVehicle(options?: any) {
    return await this.vehicleService.findOne({
      where: { ...options.where },
      relations: {
        images: true,
        seats: true,
        ...options?.relations,
      },
      select: {
        seats: {
          id: true,
          name: true,
          type: true,
          floor: true,
        },
        images: {
          id: true,
          url: true,
          createdAt: true,
        },
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }

  async findOneVehicleById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneVehicle(options);
  }

  async findOneVehicleByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneVehicle(options);
  }

  async getVehicleTypes() {
    return {
      dataResult: Object.keys(VehicleTypeEnum).map((key) => ({
        key,
        value: VehicleTypeEnum[key],
        numOfSeats: VehicleSeatsEnum[key],
      })),
    };
  }

  async createVehicle(dto: CreateVehicleDto, userId: string) {
    const {
      code,
      name,
      description,
      type,
      images,
      licensePlate,
      floorNumber,
      totalSeat,
    } = dto;
    const vehicleExist = await this.findOneVehicleByCode(code, {
      withDeleted: true,
    });
    if (vehicleExist) {
      throw new BadRequestException('VEHICLE_CODE_ALREADY_EXIST');
    }

    const vehicle = new Vehicle();
    vehicle.code = code;
    vehicle.name = name;
    vehicle.description = description;

    if (!type) {
      throw new BadRequestException('VEHICLE_TYPE_REQUIRED');
    }
    vehicle.type = type;
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

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    vehicle.createdBy = adminExist.id;

    const newVehicle = await this.vehicleService.save(vehicle);
    if (images && images.length > 0) {
      const newImages = await images.map(async (image) => {
        image.createdBy = adminExist.id;
        const newImage = await this.imageResourceService.saveImageResource(
          image,
          adminExist.id,
          newVehicle.id,
        );
        delete newImage.vehicle;
        delete newImage.createdBy;
        delete newImage.updatedBy;
        delete newImage.deletedAt;

        return newImage;
      });
      newVehicle.images = await Promise.all(newImages);
    }

    // create seats
    const numOfSeat = Math.round(totalSeat / 2);
    for (let i = 1; i <= totalSeat; i++) {
      const dto = new CreateSeatDto();
      if (numOfSeat % 2 == 0) {
        if (numOfSeat >= i) {
          dto.code = `${code}A${i}`;
          dto.name = `A${i}`;
          dto.floor = 1;
        } else {
          dto.code = `${code}B${i}`;
          dto.name = `B${i - numOfSeat}`;
          dto.floor = 2;
        }
      } else {
        if (numOfSeat > i) {
          dto.code = `${code}A${numOfSeat - i}`;
          dto.name = `A${i}`;
          dto.floor = 1;
        } else {
          dto.code = `${code}B${i - numOfSeat}`;
          dto.name = `B${i - numOfSeat}`;
          dto.floor = 2;
        }
      }
      dto.type = SeatTypeEnum.NON_SOLD;
      dto.vehicleId = newVehicle.id;
      await this.seatService.createSeat(dto, userId);
    }
    delete newVehicle.deletedAt;
    return newVehicle;
  }

  async getVehicleById(id: string, options?: any) {
    const vehicle = await this.findOneVehicleById(id, options);
    if (!vehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    return vehicle;
  }

  async getVehicleByCode(code: string, options?: any) {
    const vehicle = await this.findOneVehicleByCode(code, options);
    if (!vehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    return vehicle;
  }

  async findAllVehicle(dto: FilterVehicleDto, pagination?: Pagination) {
    const { keywords, type, floorNumber } = dto;
    const query = this.vehicleService.createQueryBuilder('q');

    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.licensePlate like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.description like :keywords', { keywords: `%${keywords}%` });
    }
    if (
      type == VehicleTypeEnum.LIMOUSINE ||
      type == VehicleTypeEnum.SLEEPER_BUS ||
      type == VehicleTypeEnum.SEAT_BUS
    ) {
      query.andWhere('q.type = :type', { type });
    }
    if (floorNumber == 1 || floorNumber == 2) {
      query.andWhere('q.floorNumber = :floorNumber', { floorNumber });
    }

    const total = await query.getCount();
    const dataResult = await query
      .orderBy('q.createdAt', SortEnum.DESC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    if (dataResult && dataResult.length > 0) {
      // query image for each vehicle
      const queryImage = this.dataSource
        .getRepository(ImageResource)
        .createQueryBuilder('i');
      const images = await queryImage
        .andWhere('i.vehicle_id IN (:...ids)', {
          ids: dataResult.map((station) => station.id),
        })
        .leftJoinAndSelect('i.vehicle', 'v')
        .select(['i.id', 'i.url', 'i.updatedAt', 'i.createdAt', 'v.id'])
        .getMany();

      // add image to vehicle
      dataResult.forEach((vehicle) => {
        vehicle.images = images.filter(
          (image) => image.vehicle.id === vehicle.id,
        );
      });
    }
    return { dataResult, pagination, total };
  }

  async updateVehicleById(dto: UpdateVehicleDto, userId: string, id: string) {
    const {
      name,
      description,
      licensePlate,
      type,
      floorNumber,
      totalSeat,
      images,
    } = dto;

    const vehicle = await this.findOneVehicleById(id);
    if (!vehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (name) {
      vehicle.name = name;
    }
    if (description) {
      vehicle.description = description;
    }
    if (licensePlate && licensePlate.match(LICENSE_PLATE_REGEX)) {
      vehicle.licensePlate = licensePlate;
    }
    if (type) {
      vehicle.type = type;
    }
    if (floorNumber && (floorNumber == 1 || floorNumber == 2)) {
      vehicle.floorNumber = floorNumber;
    } else {
      vehicle.floorNumber = 1;
    }
    if (totalSeat) {
      vehicle.totalSeat = totalSeat;
    }
    vehicle.updatedBy = adminExist.id;

    const updateVehicle = await this.vehicleService.save(vehicle);
    if (images && images.length > 0) {
      const newImages = await images.map(async (image) => {
        const newImage = await this.imageResourceService.saveImageResource(
          image,
          adminExist.id,
          updateVehicle.id,
        );
        delete newImage.vehicle;
        delete newImage.createdBy;
        delete newImage.updatedBy;
        delete newImage.deletedAt;

        return newImage;
      });
      updateVehicle.images = await Promise.all(newImages);
    }
    return updateVehicle;
  }

  async deleteVehicleById(userId: string, id: string) {
    const hiddenVehicle = await this.vehicleService.findOne({ where: { id } });
    if (!hiddenVehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    hiddenVehicle.deletedAt = new Date();
    hiddenVehicle.updatedBy = adminExist.id;

    return await this.vehicleService.save(hiddenVehicle);
  }

  async deleteMultipleVehicle(userId: string, dto: VehicleDeleteMultiInput) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(
          async (id) => await (await this.deleteVehicleById(userId, id)).id,
        ),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
