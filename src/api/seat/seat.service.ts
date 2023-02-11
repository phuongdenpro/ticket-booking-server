import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat, Staff, Vehicle } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { FilterSeatDto, SaveSeatDto, UpdateSeatDto } from './dto';
import { Pagination } from 'src/decorator';
import { SeatTypeEnum } from 'src/enums';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private dataSource: DataSource,
  ) {}

  async saveSeat(dto: SaveSeatDto, userId: string) {
    const { name, type, floor, vehicleId } = dto;
    const vehicle = await this.dataSource
      .getRepository(Vehicle)
      .findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
    }

    const seat = new Seat();
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
    delete seat.vehicle;
    delete seat.updatedAt;

    return await this.seatRepository.save(seat);
  }

  async searchSeat(dto: FilterSeatDto, pagination?: Pagination) {
    const { name, type, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');

    if (name) {
      query.andWhere('q.name like :name', { name: `%${name}%` });
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
        'q.isDeleted',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: false })
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
    const { name, type, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');
    query.where('q.vehicle = :vehicleId', { vehicleId });

    if (name) {
      query.andWhere('q.name like :name', { name: `%${name}%` });
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
        'q.isDeleted',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: false })
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async findOneSeatById(id: string) {
    const query = this.seatRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query
      .select([
        'q.id',
        'q.name',
        'q.type',
        'q.floor',
        'q.isDeleted',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: true })
      .getOne();

    return { dataResult };
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
        'q.isDeleted',
        'q.createdBy',
        'q.updatedBy',
        'q.createdAt',
        'q.updatedAt',
      ])
      .andWhere('q.isDeleted = :isDeleted', { isDeleted: false })
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateSeatById(id: string, dto: UpdateSeatDto, userId: string) {
    const { name, type, floor, vehicleId } = dto;
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
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

  async hiddenSeatById(id: string, userId: string) {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) {
      throw new BadRequestException('SEAT_NOT_FOUND');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOneBy({ id: userId });
    if (!adminExist) {
      throw new UnauthorizedException();
    }

    return await this.seatRepository.save(seat);
  }
}
