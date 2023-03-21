import {
  CreateTripDto,
  FilterTripDto,
  UpdateTripDto,
  TripDeleteMultiInput,
} from './dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, Station, Trip } from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { SortEnum, TripStatusEnum } from './../../enums';
import { Pagination } from './../../decorator';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private dataSource: DataSource,
  ) {}

  private tripSelectFieldsWithQ = [
    'q.id',
    'q.name',
    'q.note',
    'q.startDate',
    'q.endDate',
    'q.createdBy',
    'q.updatedBy',
    'q.isActive',
    'q.createdAt',
    'q.updatedAt',
    'fs.id',
    'fs.name',
    'to.id',
    'to.name',
  ];

  async findOneTripById(id: string, options?: any) {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['fromStation', 'toStation'],
      select: {
        fromStation: { id: true, name: true, code: true },
        toStation: { id: true, name: true, code: true },
      },
      ...options,
    });

    return trip;
  }

  async findOneTripByCode(code: string, options?: any) {
    return await this.tripRepository.findOne({
      where: { code },
      relations: ['fromStation', 'toStation'],
      select: {
        fromStation: { id: true, name: true, code: true },
        toStation: { id: true, name: true, code: true },
      },
      ...options,
    });
  }

  async createTrip(dto: CreateTripDto, userId: string) {
    const {
      code,
      name,
      note,
      startDate,
      endDate,
      fromStationId,
      toStationId,
      isActive,
    } = dto;
    // check permission
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    // check trip code exist
    const tripExist = await this.tripRepository.findOne({
      where: { code },
    });
    if (tripExist) {
      throw new BadRequestException('TRIP_CODE_EXIST');
    }

    const trip = new Trip();
    trip.code = code;
    if (!name) {
      throw new BadRequestException('NAME_IS_REQUIRED');
    }
    trip.name = name;
    trip.note = note;
    // check start date
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    trip.startDate = startDate;
    // check end date
    if (endDate) {
      if (endDate < currentDate && endDate < startDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_START_DATE');
      } else {
        trip.endDate = endDate;
      }
    }
    // check from station
    const fromStation = await this.dataSource
      .getRepository(Station)
      .findOne({ where: { id: fromStationId } });
    if (!fromStation) {
      throw new BadRequestException('FROM_STATION_NOT_FOUND');
    }
    trip.fromStation = fromStation;
    // check to station
    const toStation = await this.dataSource
      .getRepository(Station)
      .findOne({ where: { id: toStationId } });
    if (!toStation) {
      throw new BadRequestException('TO_STATION_NOT_FOUND');
    }
    trip.toStation = toStation;
    if (fromStationId === toStationId) {
      throw new BadRequestException('FROM_STATION_AND_TO_STATION_IS_SAME');
    }

    if (isActive === undefined || isActive === null) {
      trip.isActive = true;
    } else {
      trip.isActive = TripStatusEnum.ACTIVE === isActive;
    }

    trip.createdBy = adminExist.id;
    trip.updatedBy = adminExist.id;
    const saveTrip = await this.tripRepository.save(trip);
    delete saveTrip.fromStation;
    delete saveTrip.toStation;
    delete saveTrip.deletedAt;
    return {
      ...saveTrip,
      fromStation: {
        id: fromStation.id,
        name: fromStation.name,
      },
      toStation: {
        id: toStation.id,
        name: toStation.name,
      },
    };
  }

  async findAllTrip(dto: FilterTripDto, pagination?: Pagination) {
    const { keywords, fromStationId, toStationId } = dto;
    let { startDate, endDate } = dto;
    const query = this.tripRepository.createQueryBuilder('q');

    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note like :keywords', { keywords: `%${keywords}%` });
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate && startDate >= currentDate) {
      startDate = new Date(startDate);
      query.andWhere('q.startDate >= :startDate', { startDate });
    }
    if (endDate && endDate >= currentDate && endDate >= startDate) {
      endDate = new Date(endDate);
      query.andWhere('q.endDate >= :endDate', { endDate });
    }
    if (fromStationId) {
      query.andWhere('q.fromStation = :fromStationId', { fromStationId });
    }
    if (toStationId) {
      query.andWhere('q.toStation = :toStationId', { toStationId });
    }

    const total = await query.getCount();
    const dataResult = await query
      .andWhere('q.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('q.fromStation', 'fs')
      .leftJoinAndSelect('q.toStation', 'to')
      .select(this.tripSelectFieldsWithQ)
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getTripById(id: string) {
    const trip = await this.findOneTripById(id);
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    return trip;
  }

  async getTripByCode(code: string) {
    const trip = await this.findOneTripByCode(code);
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    return trip;
  }

  async updateTripById(id: string, dto: UpdateTripDto, userId: string) {
    const {
      name,
      note,
      startDate,
      endDate,
      fromStationId,
      toStationId,
      isActive,
    } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    if (name) {
      trip.name = name;
    }
    if (note) {
      trip.note = note;
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate !== undefined || startDate !== null) {
      if (startDate < currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      trip.startDate = startDate;
    }
    if (endDate !== undefined || endDate !== null) {
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      trip.endDate = endDate;
    }

    if (fromStationId) {
      const fromStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: fromStationId } });
      if (!fromStation) {
        throw new BadRequestException('FROM_STATION_NOT_FOUND');
      }
      trip.fromStation = fromStation;
    }
    if (toStationId) {
      const toStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: toStationId } });
      if (!toStation) {
        throw new BadRequestException('TO_STATION_NOT_FOUND');
      }
      trip.toStation = toStation;
    }
    if (fromStationId === toStationId) {
      throw new BadRequestException('FROM_STATION_AND_TO_STATION_IS_SAME');
    }
    if (isActive) {
      trip.isActive = TripStatusEnum.ACTIVE === isActive;
    }
    trip.updatedBy = adminExist.id;

    const updateTrip = await this.tripRepository.save(trip);
    return {
      id: updateTrip.id,
      name: updateTrip.name,
      note: updateTrip.note,
      startDate: updateTrip.startDate,
      endDate: updateTrip.endDate,
      isActive: updateTrip.isActive,
      createdBy: updateTrip.createdBy,
      updatedBy: updateTrip.updatedBy,
      createdAt: updateTrip.createdAt,
      updatedAt: updateTrip.updatedAt,
      fromStation: {
        id: updateTrip.fromStation.id,
        name: updateTrip.fromStation.name,
      },
      toStation: {
        id: updateTrip.toStation.id,
        name: updateTrip.toStation.name,
      },
    };
  }

  async updateTripByCode(code: string, dto: UpdateTripDto, userId: string) {
    const {
      name,
      note,
      startDate,
      endDate,
      fromStationId,
      toStationId,
      isActive,
    } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const trip = await this.tripRepository.findOne({ where: { code } });
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    if (name) {
      trip.name = name;
    }
    if (note) {
      trip.note = note;
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate !== undefined || startDate !== null) {
      if (startDate < currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      trip.startDate = startDate;
    }
    if (endDate !== undefined || endDate !== null) {
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      trip.endDate = endDate;
    }

    if (fromStationId) {
      const fromStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: fromStationId } });
      if (!fromStation) {
        throw new BadRequestException('FROM_STATION_NOT_FOUND');
      }
      trip.fromStation = fromStation;
    }
    if (toStationId) {
      const toStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: toStationId } });
      if (!toStation) {
        throw new BadRequestException('TO_STATION_NOT_FOUND');
      }
      trip.toStation = toStation;
    }
    if (fromStationId === toStationId) {
      throw new BadRequestException('FROM_STATION_AND_TO_STATION_IS_SAME');
    }
    if (isActive) {
      trip.isActive = TripStatusEnum.ACTIVE === isActive;
    }
    trip.updatedBy = adminExist.id;

    const updateTrip = await this.tripRepository.save(trip);
    return {
      id: updateTrip.id,
      name: updateTrip.name,
      note: updateTrip.note,
      startDate: updateTrip.startDate,
      endDate: updateTrip.endDate,
      isActive: updateTrip.isActive,
      createdBy: updateTrip.createdBy,
      updatedBy: updateTrip.updatedBy,
      createdAt: updateTrip.createdAt,
      updatedAt: updateTrip.updatedAt,
      fromStation: {
        id: updateTrip.fromStation.id,
        name: updateTrip.fromStation.name,
      },
      toStation: {
        id: updateTrip.toStation.id,
        name: updateTrip.toStation.name,
      },
    };
  }

  async deleteTripById(id: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    return await (
      await this.tripRepository.save(trip)
    ).id;
  }

  async deleteTripByCode(code: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const trip = await this.tripRepository.findOne({ where: { code } });
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    return await (
      await this.tripRepository.save(trip)
    ).id;
  }

  async deleteMultipleTrip(userId: string, dto: TripDeleteMultiInput) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deleteTripById(id, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleTripByCodes(userId: string, dto: TripDeleteMultiInput) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (code) => await this.deleteTripByCode(code, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
