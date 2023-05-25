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
import { Staff, Station, Trip, TripDetail } from './../../database/entities';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { SortEnum, DeleteDtoTypeEnum, ActiveStatusEnum } from './../../enums';
import { Pagination } from './../../decorator';
import * as moment from 'moment';
import { TripDetailService } from '../trip-detail/trip-detail.service';
import { UpdateTripDetailForTripDto } from '../trip-detail/dto';
// moment.locale('vi');

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly tripDetailService: TripDetailService,
    private dataSource: DataSource,
  ) {}

  private tripSelectFieldsWithQ = [
    'q.id',
    'q.code',
    'q.name',
    'q.note',
    'q.startDate',
    'q.endDate',
    'q.createdBy',
    'q.updatedBy',
    'q.status',
    'q.createdAt',
    'q.updatedAt',
    'fs.id',
    'fs.code',
    'fs.name',
    'ts.id',
    'ts.code',
    'ts.name',
  ];

  async findOneTrip(options?: any) {
    const trip = await this.tripRepository.findOne({
      where: { ...options?.where },
      relations: {
        fromStation: true,
        toStation: true,
        ...options?.relations,
      },
      select: {
        fromStation: {
          id: true,
          name: true,
          code: true,
          ...options?.select?.fromStation,
        },
        toStation: {
          id: true,
          name: true,
          code: true,
          ...options?.select?.toStation,
        },
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options.other,
    });

    return trip;
  }

  async findOneTripById(id: string, options?: any) {
    if (!id) {
      throw new BadRequestException('TRIP_ID_REQUIRED');
    }
    if (options) {
      options.where = { id, ...options.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneTrip(options);
  }

  async findOneTripByCode(code: string, options?: any) {
    if (!code) {
      throw new BadRequestException('TRIP_CODES_IS_REQUIRED');
    }
    if (options) {
      options.where = { code, ...options.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneTrip(options);
  }

  async getTripStatus() {
    return {
      dataResult: Object.keys(ActiveStatusEnum).map(
        (key) => ActiveStatusEnum[key],
      ),
    };
  }

  async createTrip(dto: CreateTripDto, userId: string) {
    const {
      code,
      name,
      note,
      startDate,
      endDate,
      travelHours,
      fromStationId,
      toStationId,
      status,
    } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    // check trip code exist
    const tripExist = await this.findOneTripById(code, {
      other: {
        withDeleted: true,
      },
    });
    if (tripExist) {
      throw new BadRequestException('TRIP_CODE_EXIST');
    }

    const trip = new Trip();
    trip.code = code;
    trip.name = name;
    trip.note = note;
    // check start date
    const currentDate = moment().startOf('day').add(7, 'hour').toDate();
    const newStartDate = moment(startDate)
      .startOf('day')
      .add(7, 'hour')
      .toDate();
    if (newStartDate <= currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    trip.startDate = newStartDate;
    // check end date

    const newEndDate = moment(endDate).startOf('day').add(7, 'hour').toDate();
    if (newEndDate < currentDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
    }
    if (newEndDate <= startDate) {
      throw new BadRequestException(
        'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE',
      );
    }
    trip.endDate = newEndDate;

    if (!travelHours) {
      throw new BadRequestException('TRAVEL_HOURS_IS_REQUIRED');
    }
    if (travelHours < 1) {
      throw new BadRequestException(
        'TRAVEL_HOURS_MUST_BE_GREATER_THAN_OR_EQUAL_TO_ONE',
      );
    }
    trip.travelHours = travelHours;
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
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
      case ActiveStatusEnum.INACTIVE:
        trip.status = status;
        break;
      default:
        throw new BadRequestException('TRIP_STATUS_IS_ENUM');
    }
    trip.createdBy = adminExist.id;

    const saveTrip = await this.tripRepository.save(trip);
    delete saveTrip.fromStation;
    delete saveTrip.toStation;
    delete saveTrip.deletedAt;
    return {
      ...saveTrip,
      fromStation: {
        id: fromStation.id,
        code: fromStation.code,
        name: fromStation.name,
      },
      toStation: {
        id: toStation.id,
        code: toStation.code,
        name: toStation.name,
      },
    };
  }

  async findAllTrip(dto: FilterTripDto, pagination?: Pagination) {
    const {
      keywords,
      fromStationId,
      toStationId,
      status,
      startDate,
      endDate,
      minTravelHours,
      maxTravelHours,
      toStationCode,
      fromStationCode,
      sort,
    } = dto;
    const query = this.tripRepository.createQueryBuilder('q');

    if (keywords) {
      const newKeywords = keywords.trim();
      const subQuery = this.tripRepository
        .createQueryBuilder('q')
        .select('q.id')
        .where('q.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('q.name LIKE :name', { name: `%${newKeywords}%` })
        .getQuery();

      query.andWhere(`q.id in (${subQuery})`, {
        code: `%${newKeywords}%`,
        name: `%${newKeywords}%`,
      });
    }

    if (startDate) {
      const newStartDate = moment(startDate)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      query.andWhere('q.startDate >= :startDate', { startDate: newStartDate });
    }
    if (endDate) {
      const newEndDate = moment(endDate).startOf('day').add(7, 'hour').toDate();
      query.andWhere('q.endDate <= :endDate', { endDate: newEndDate });
    }
    if (fromStationId) {
      query.andWhere('fs.id = :fromStationId', { fromStationId });
    }
    if (toStationId) {
      query.andWhere('ts.id = :toStationId', { toStationId });
    }
    if (fromStationCode) {
      query.andWhere('fs.code = :fromStationCode', { fromStationCode });
    }
    if (toStationCode) {
      query.andWhere('ts.code = :toStationCode', { toStationCode });
    }
    if (minTravelHours) {
      query.andWhere('q.travelHours >= :minTravelHours', { minTravelHours });
    }
    if (maxTravelHours) {
      query.andWhere('q.travelHours <= :maxTravelHours', { maxTravelHours });
    }
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
      case ActiveStatusEnum.INACTIVE:
        query.andWhere('q.status = :status', { status });
        break;
      default:
        break;
    }

    const dataResult = await query
      .leftJoinAndSelect('q.fromStation', 'fs')
      .leftJoinAndSelect('q.toStation', 'ts')
      .select(this.tripSelectFieldsWithQ)
      .orderBy('q.name', SortEnum.ASC)
      .addOrderBy('q.code', SortEnum.ASC)
      .addOrderBy('q.createdAt', sort || SortEnum.DESC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    const total = await query.getCount();

    return { dataResult, pagination, total };
  }

  async getTripById(id: string, options?: any) {
    const trip = await this.findOneTripById(id, options);
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    return trip;
  }

  async getTripByCode(code: string, options?: any) {
    const trip = await this.findOneTripByCode(code, options);
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    return trip;
  }

  async updateTripByIdOrCode(
    dto: UpdateTripDto,
    userId: string,
    id?: string,
    code?: string,
  ) {
    const {
      name,
      note,
      startDate,
      endDate,
      travelHours,
      fromStationId,
      toStationId,
      status,
    } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_IS_REQUIRED');
    }
    let trip: Trip;
    if (id) {
      trip = await this.getTripById(id);
    } else if (code) {
      trip = await this.getTripByCode(code);
    }
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    if (name) {
      trip.name = name;
    }
    if (note) {
      trip.note = note;
    }

    const currentDate = moment().startOf('day').add(7, 'hour').toDate();
    if (startDate) {
      const newStartDate = moment(startDate)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      const oldStartDate = moment(trip.startDate)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      if (newStartDate.getTime() !== oldStartDate.getTime()) {
        if (newStartDate <= currentDate) {
          throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
        }
        if (
          (endDate && newStartDate > endDate) ||
          (!endDate && newStartDate > trip.endDate)
        ) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_START_DATE',
          );
        }
        trip.startDate = newStartDate;
      }
    }
    if (endDate) {
      const newEndDate = moment(endDate).startOf('day').add(7, 'hour').toDate();
      const oldEndDate = moment(trip.endDate)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      if (newEndDate.getTime() !== oldEndDate.getTime()) {
        if (newEndDate < currentDate) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_NOW',
          );
        }
        if (
          (startDate && newEndDate < startDate) ||
          (!startDate && newEndDate < trip.startDate)
        ) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE',
          );
        }
        trip.endDate = newEndDate;
      }
    }

    const queryTrip =
      this.tripRepository.manager.connection.createQueryRunner();
    await queryTrip.connect();
    await queryTrip.startTransaction();
    let updateTrip: Trip;

    const queryTripDetail = this.dataSource
      .getRepository(TripDetail)
      .manager.connection.createQueryRunner();
    await queryTripDetail.connect();
    await queryTripDetail.startTransaction();
    try {
      if (travelHours) {
        if (travelHours < 1) {
          throw new BadRequestException(
            'TRAVEL_HOURS_MUST_BE_GREATER_THAN_OR_EQUAL_TO_ONE',
          );
        }
        if (trip.travelHours !== travelHours) {
          trip.travelHours = travelHours;
          const tomorrow = moment().startOf('days').add(1, 'days').toDate();
          console.log('trip.code', trip.code);
          
          const tripDetails = await this.findOneTripByCode(trip.code, {
            relations: {
              tripDetails: true,
            },
            where: {
              tripDetails: {
                departureTime: MoreThanOrEqual(tomorrow),
              },
            },
          });
          if (tripDetails && tripDetails.tripDetails.length > 0) {
            const updateTripDetails = tripDetails.tripDetails.map(
              async (tripDetail) => {
                const dto = new UpdateTripDetailForTripDto();
                dto.travelHours = travelHours;
                await this.tripDetailService.updateTripDetailByIdOrCode(
                  dto,
                  userId,
                  tripDetail.id,
                  undefined,
                  queryTripDetail.connection.createEntityManager(),
                );
              },
            );
            await Promise.all(updateTripDetails);
          }
        }
      }
      // throw new BadRequestException('TEST');
      if (fromStationId) {
        if (fromStationId === toStationId) {
          throw new BadRequestException('FROM_STATION_AND_TO_STATION_IS_SAME');
        }
        const fromStation = await this.dataSource
          .getRepository(Station)
          .findOne({ where: { id: fromStationId } });
        if (!fromStation) {
          throw new BadRequestException('FROM_STATION_NOT_FOUND');
        }
        trip.fromStation = fromStation;
      }
      if (toStationId) {
        if (fromStationId === toStationId) {
          throw new BadRequestException('FROM_STATION_AND_TO_STATION_IS_SAME');
        }
        const toStation = await this.dataSource
          .getRepository(Station)
          .findOne({ where: { id: toStationId } });
        if (!toStation) {
          throw new BadRequestException('TO_STATION_NOT_FOUND');
        }
        trip.toStation = toStation;
      }
      switch (status) {
        case ActiveStatusEnum.ACTIVE:
        case ActiveStatusEnum.INACTIVE:
          trip.status = status;
          break;
        default:
          break;
      }
      trip.updatedBy = adminExist.id;
      updateTrip = await queryTrip.manager.save(trip);
      await queryTrip.commitTransaction();
    } catch (e) {
      await queryTrip.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryTrip.release();
    }

    return {
      id: updateTrip.id,
      name: updateTrip.name,
      note: updateTrip.note,
      startDate: updateTrip.startDate,
      endDate: updateTrip.endDate,
      travelHours: updateTrip.travelHours,
      isActive: updateTrip.status,
      createdBy: updateTrip.createdBy,
      updatedBy: updateTrip.updatedBy,
      createdAt: updateTrip.createdAt,
      updatedAt: updateTrip.updatedAt,
      fromStation: {
        id: updateTrip.fromStation.id,
        code: updateTrip.fromStation.code,
        name: updateTrip.fromStation.name,
      },
      toStation: {
        id: updateTrip.toStation.id,
        code: updateTrip.toStation.code,
        name: updateTrip.toStation.name,
      },
    };
  }

  async deleteTripByIdOrCode(adminId: string, id?: string, code?: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_IS_REQUIRED');
    }
    let trip: Trip;
    if (id) {
      trip = await this.getTripById(id);
    } else if (code) {
      trip = await this.getTripByCode(code);
    }
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    const saveTrip = await this.tripRepository.save(trip);
    return {
      id: saveTrip.id,
      code: saveTrip.code,
      message: 'Xoá tuyến xe thành công',
    };
  }

  async deleteMultipleTripByIdsOrCodes(
    userId: string,
    dto: TripDeleteMultiInput,
    type: DeleteDtoTypeEnum,
  ) {
    try {
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (data) => {
          if (!data) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: `${type} không được để trống`,
            };
          }
          let trip;
          if (type === DeleteDtoTypeEnum.ID) {
            trip = await this.getTripById(data);
          } else if (type === DeleteDtoTypeEnum.CODE) {
            trip = await this.getTripByCode(data);
          }
          if (!trip) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: 'Không tìm thấy tuyến xe',
            };
          }
          trip.deletedAt = new Date();
          trip.updatedBy = adminExist.id;

          const saveTrip = await this.tripRepository.softRemove(trip);
          return {
            id: saveTrip.id,
            code: saveTrip.code,
            message: 'Xoá tuyến xe thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
