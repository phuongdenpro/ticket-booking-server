import { SortEnum, UserStatusEnum } from './../../enums';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, Seat, Staff, Vehicle } from './../../database/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
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

  async findOneSeat(options: any) {
    return await this.seatRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async findOneSeatById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneSeat(options);
  }

  async findOneSeatByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneSeat(options);
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

  async createSeat(dto: CreateSeatDto, userId: string) {
    const { code, name, floor, vehicleId } = dto;
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

    const seatExist = await this.findOneSeatByCode(code);
    if (seatExist) {
      throw new BadRequestException('SEAT_CODE_ALREADY_EXIST');
    }
    const seat = new Seat();
    seat.code = code;
    seat.name = name;

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
    const { keywords, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');

    if (keywords) {
      const newKeywords = keywords.trim();
      const subQuery = this.seatRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('q2.name LIKE :name', { name: `%${newKeywords}%` })
        .select('q2.id')
        .getQuery();
      query.andWhere(`q.id IN (${subQuery})`, {
        code: `%${newKeywords}%`,
        name: `%${newKeywords}%`,
      });
    }
    // if (status) {
    //   query
    //     .leftJoinAndSelect('q.ticketDetails', 'td')
    //     .andWhere('td.status = :type', { type: status });
    // }
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
    const { keywords, floor } = dto;
    const query = this.seatRepository.createQueryBuilder('q');
    query.where('q.vehicle = :vehicleId', { vehicleId });

    if (keywords) {
      const newKeywords = keywords.trim();
      const subQuery = this.seatRepository
        .createQueryBuilder('q2')
        .where('q.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('q.name LIKE :name', { name: `%${newKeywords}%` })
        .select('q2.id');
      query.andWhere(`q.id IN (${subQuery.getQuery()})`, {
        code: `%${newKeywords}%`,
        name: `%${newKeywords}%`,
      });
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

  async updateSeatByIdOrCode(
    dto: UpdateSeatDto,
    userId: string,
    id?: string,
    code?: string,
    manager?: EntityManager,
  ) {
    const { name, floor, vehicleId } = dto;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    let seat: Seat;
    if (id) {
      seat = await this.getSeatById(id);
    } else if (code) {
      seat = await this.getSeatByCode(code);
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    const customerExist = await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { id: userId } });

    if (!adminExist && !customerExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (
      (adminExist && !adminExist.isActive) ||
      (customerExist && customerExist.status === UserStatusEnum.INACTIVATE)
    ) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    if (name) {
      seat.name = name;
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
      if (!vehicle) {
        throw new BadRequestException('VEHICLE_NOT_FOUND');
      }
      seat.vehicle = vehicle;
    }
    seat.updatedBy = adminExist.id;
    delete seat.vehicle;
    let saveSeat: Seat;
    if (manager) {
      try {
        saveSeat = await manager.save(seat);
      } catch (error) {
        throw new BadRequestException('UPDATE_SEAT_FAILED');
      }
    } else {
      saveSeat = await this.seatRepository.save(seat);
    }
    return saveSeat;
  }

  async deleteSeatByIdOrCode(userId: string, id?: string, code?: string) {
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    let seat: Seat;
    if (id) {
      seat = await this.getSeatById(id);
    } else if (code) {
      seat = await this.getSeatByCode(code);
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
    seat.updatedBy = adminExist.id;
    seat.deletedAt = new Date();

    return await this.seatRepository.save(seat);
  }

  async deleteMultipleTripById(userId: string, dto: SeatDeleteMultiInput) {
    try {
      const { data: ids } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const list = await Promise.all(
        ids.map(async (id) => {
          const seat = await this.findOneSeatById(id);
          if (!seat) {
            return {
              id: id,
              message: 'Không tìm thấy ghế',
            };
          }
          seat.updatedBy = adminExist.id;
          seat.deletedAt = new Date();
          const saveSeat = await this.seatRepository.save(seat);
          return {
            id: saveSeat.id,
            message: 'Xoá ghế thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleTripByCode(userId: string, dto: SeatDeleteMultiInput) {
    try {
      const { data: codes } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const list = await Promise.all(
        codes.map(async (code) => {
          const seat = await this.findOneSeatByCode(code);
          if (!seat) {
            return {
              code: code,
              message: 'Không tìm thấy ghế',
            };
          }
          seat.updatedBy = adminExist.id;
          seat.deletedAt = new Date();
          const saveSeat = await this.seatRepository.save(seat);
          return {
            id: saveSeat.id,
            message: 'Xoá ghế thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
