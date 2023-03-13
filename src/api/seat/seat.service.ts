import { SeatTypeEnum, SortEnum } from './../../enums';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, Seat, Staff, Vehicle } from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import {
  FilterSeatDto,
  CreateSeatDto,
  SeatDeleteMultiInput,
  UpdateSeatDto,
} from './dto';
import { Pagination } from './../../decorator';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private dataSource: DataSource,
  ) {}

  async findOneSeatById(id: string, options?: any) {
    return await this.seatRepository.findOne({
      where: { id, ...options?.where },
      relations: [].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async findOneSeatByCode(code: string, options?: any) {
    return await this.seatRepository.findOne({
      where: { code, ...options?.where },
      relations: [].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async createSeat(dto: CreateSeatDto, userId: string) {
    const { code, name, type, floor, vehicleId } = dto;
    const vehicle = await this.dataSource
      .getRepository(Vehicle)
      .findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }

    const seatExist = this.getSeatByCode(code, {
      withDeleted: true,
    });
    if (!seatExist) {
      throw new BadRequestException('SEAT_CODE_ALREADY_EXIST');
    }
    const seat = new Seat();
    seat.code = code;
    seat.name = name;
    if (!seat) {
      seat.type = SeatTypeEnum.NON_SALES;
    } else {
      seat.type = type;
    }
    if (floor < 1 || floor > 2 || !floor) {
      seat.floor = 1;
    } else {
      seat.floor = floor;
    }
    seat.createdBy = adminExist.id;
    seat.vehicle = vehicle;
    const saveSeat = await this.seatRepository.save(seat);
    delete seat.vehicle;
    delete seat.deletedAt;

    return saveSeat;
  }

  async searchSeat(dto: FilterSeatDto, pagination?: Pagination) {
    const { keywords, type, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');

    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name like :keywords', { keywords: `%${keywords}%` });
    }
    if (type) {
      query.andWhere('q.type = :type', { type });
    }
    if (floor && floor > 0 && floor < 3) {
      query.andWhere('q.floor = :floor', { floor });
    }

    const total = await query.clone().getCount();
    const dataResult = await query
      .select([
        'q.id',
        'q.name',
        'q.type',
        'q.floor',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async searchSeatWithVehicleId(
    dto: FilterSeatDto,
    vehicleId: string,
    pagination?: Pagination,
  ) {
    const { keywords, type, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');
    query.where('q.vehicle = :vehicleId', { vehicleId });

    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name like :keywords', { keywords: `%${keywords}%` });
    }
    if (type) {
      query.andWhere('q.type = :type', { type });
    }
    if (floor && floor > 0 && floor < 3) {
      query.andWhere('q.floor = :floor', { floor });
    }

    const total = await query.clone().getCount();
    const dataResult = await query
      .select([
        'q.id',
        'q.name',
        'q.type',
        'q.floor',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getSeatById(id: string, options?: any) {
    const seat = await this.findOneSeatById(id, options);
    if (!seat) {
      throw new NotFoundException('SEAT_NOT_FOUND');
    }
    return seat;
  }

  async getSeatByCode(code: string, options?: any) {
    const seat = await this.findOneSeatByCode(code, options);
    if (!seat) {
      throw new NotFoundException('SEAT_NOT_FOUND');
    }
    return seat;
  }

  async findAllSeatByVehicleId(vehicleId: string, pagination?: Pagination) {
    const query = this.seatRepository.createQueryBuilder('q');
    query.where('q.vehicle = :vehicleId', { vehicleId });

    const total = await query.clone().getCount();
    const dataResult = await query
      .select([
        'q.id',
        'q.name',
        'q.type',
        'q.floor',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateSeatById(id: string, dto: UpdateSeatDto, userId: string) {
    const { name, type, floor, vehicleId } = dto;
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) {
      throw new NotFoundException('SEAT_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    const customerExist = await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { id: userId } });
    if (!adminExist || !customerExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive || customerExist.status == 0) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    if (name) {
      seat.name = name;
    }
    if (seat) {
      seat.type = SeatTypeEnum.NON_SALES;
    } else {
      seat.type = type;
    }
    if (floor < 1 || floor > 2 || !floor) {
      seat.floor = 1;
    } else {
      seat.floor = floor;
    }
    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      seat.vehicle = vehicle;
    }
    seat.updatedBy = adminExist.id;
    delete seat.vehicle;

    return await this.seatRepository.save(seat);
  }

  async updateSeatByCode(code: string, dto: UpdateSeatDto, userId: string) {
    const { name, type, floor, vehicleId } = dto;
    const seat = await this.seatRepository.findOne({ where: { code } });
    if (!seat) {
      throw new NotFoundException('SEAT_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    if (name) {
      seat.name = name;
    }
    if (seat) {
      seat.type = SeatTypeEnum.NON_SALES;
    } else {
      seat.type = type;
    }
    if (floor < 1 || floor > 2 || !floor) {
      seat.floor = 1;
    } else {
      seat.floor = floor;
    }
    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      seat.vehicle = vehicle;
    }
    seat.updatedBy = adminExist.id;
    delete seat.vehicle;

    return await this.seatRepository.save(seat);
  }

  async deleteSeatById(id: string, userId: string) {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) {
      throw new BadRequestException('SEAT_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    seat.updatedBy = adminExist.id;
    seat.deletedAt = new Date();

    return await this.seatRepository.save(seat);
  }

  async deleteMultipleTrip(userId: string, dto: SeatDeleteMultiInput) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deleteSeatById(id, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
