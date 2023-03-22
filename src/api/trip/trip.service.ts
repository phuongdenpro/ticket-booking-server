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
import {
  PriceDetail,
  Staff,
  Station,
  TicketGroup,
  Trip,
} from './../../database/entities';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ActiveStatusEnum, SortEnum, TripStatusEnum } from './../../enums';
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
    'fs.name',
    'to.id',
    'to.name',
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
    if (options) {
      options.where = { id, ...options.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneTrip(options);
  }

  async findOneTripByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneTrip(options);
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
      status,
      ticketGroupCode,
      ticketGroupId,
    } = dto;
    // check permission
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
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    trip.startDate = startDate;
    // check end date
    if (endDate < currentDate && endDate < startDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_START_DATE');
    }
    trip.endDate = endDate;
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
      case TripStatusEnum.ACTIVE:
        trip.status = TripStatusEnum.ACTIVE;
        break;
      default:
        trip.status = TripStatusEnum.INACTIVE;
        break;
    }
    if (!ticketGroupId && !ticketGroupCode) {
      throw new BadRequestException('TICKET_GROUP_ID_OR_CODE_REQUIRED');
    }
    let ticketGroup;
    if (ticketGroupId) {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { id: ticketGroupId } });
    } else {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { code: ticketGroupCode } });
    }
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
    }
    trip.ticketGroup = ticketGroup;

    trip.createdBy = adminExist.id;
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

  async updateTripById(id: string, dto: UpdateTripDto, userId: string) {
    const {
      name,
      note,
      startDate,
      endDate,
      fromStationId,
      toStationId,
      status,
      ticketGroupCode,
      ticketGroupId,
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

    const trip = await this.getTripById(id, {
      relations: {
        ticketGroup: true,
      },
    });
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
    switch (status) {
      case TripStatusEnum.ACTIVE:
        trip.status = TripStatusEnum.ACTIVE;
        break;
      default:
        trip.status = TripStatusEnum.INACTIVE;
        break;
    }
    const oldTicketGroup = trip.ticketGroup;
    let ticketGroup;
    if (ticketGroupId) {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { id: ticketGroupId } });
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      trip.ticketGroup = ticketGroup;
    } else {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { code: ticketGroupCode } });
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      trip.ticketGroup = ticketGroup;
    }
    if (ticketGroup) {
      const oldPriceDetail = await this.dataSource
        .getRepository(PriceDetail)
        .findOne({
          where: {
            trip: { id: trip.id },
            ticketGroup: { id: oldTicketGroup.id },
          },
          relations: {
            ticketGroup: true,
            trip: true,
          },
        });
      if (oldPriceDetail) {
        oldPriceDetail.trip = null;
        await this.dataSource.getRepository(PriceDetail).save(oldPriceDetail);
      }
      const priceDetail = await this.dataSource
        .getRepository(PriceDetail)
        .findOne({
          where: {
            priceList: {
              status: ActiveStatusEnum.ACTIVE,
              startDate: LessThanOrEqual(currentDate),
              endDate: MoreThanOrEqual(currentDate),
            },
            ticketGroup: { id: ticketGroup.id },
          },
          relations: {
            ticketGroup: true,
            priceList: true,
          },
          order: {
            priceList: {
              startDate: SortEnum.DESC,
            },
            createdAt: SortEnum.DESC,
          },
        });
      if (priceDetail) {
        priceDetail.trip = trip;
      }
    }
    trip.updatedBy = adminExist.id;

    const updateTrip = await this.tripRepository.save(trip);
    return {
      id: updateTrip.id,
      name: updateTrip.name,
      note: updateTrip.note,
      startDate: updateTrip.startDate,
      endDate: updateTrip.endDate,
      isActive: updateTrip.status,
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
      status,
      ticketGroupCode,
      ticketGroupId,
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

    const trip = await this.getTripByCode(code, {});
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
    switch (status) {
      case TripStatusEnum.ACTIVE:
        trip.status = TripStatusEnum.ACTIVE;
        break;
      default:
        trip.status = TripStatusEnum.INACTIVE;
        break;
    }
    const oldTicketGroup = trip.ticketGroup;
    let ticketGroup;
    if (ticketGroupId) {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { id: ticketGroupId } });
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      trip.ticketGroup = ticketGroup;
    } else {
      ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({ where: { code: ticketGroupCode } });
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      trip.ticketGroup = ticketGroup;
    }
    if (ticketGroup) {
      const oldPriceDetail = await this.dataSource
        .getRepository(PriceDetail)
        .findOne({
          where: {
            trip: { id: trip.id },
            ticketGroup: { id: oldTicketGroup.id },
          },
          relations: {
            ticketGroup: true,
            trip: true,
          },
        });
      if (oldPriceDetail) {
        oldPriceDetail.trip = null;
        await this.dataSource.getRepository(PriceDetail).save(oldPriceDetail);
      }
      const priceDetail = await this.dataSource
        .getRepository(PriceDetail)
        .findOne({
          where: {
            priceList: {
              status: ActiveStatusEnum.ACTIVE,
              startDate: LessThanOrEqual(currentDate),
              endDate: MoreThanOrEqual(currentDate),
            },
            ticketGroup: { id: ticketGroup.id },
          },
          relations: {
            ticketGroup: true,
            priceList: true,
          },
          order: {
            priceList: {
              startDate: SortEnum.DESC,
            },
            createdAt: SortEnum.DESC,
          },
        });
      if (priceDetail) {
        priceDetail.trip = trip;
      }
    }
    trip.updatedBy = adminExist.id;

    const updateTrip = await this.tripRepository.save(trip);
    return {
      id: updateTrip.id,
      name: updateTrip.name,
      note: updateTrip.note,
      startDate: updateTrip.startDate,
      endDate: updateTrip.endDate,
      isActive: updateTrip.status,
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
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const trip = await this.getTripById(id);
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    const saveTrip = await this.tripRepository.save(trip);
    return { id: saveTrip.id, message: 'Xoá tuyến xe thành công' };
  }

  async deleteTripByCode(code: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const trip = await this.getTripByCode(code);
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    const saveTrip = await this.tripRepository.save(trip);
    return { id: saveTrip.id, message: 'Xoá tuyến xe thành công' };
  }

  async deleteMultipleTrip(userId: string, dto: TripDeleteMultiInput) {
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
        ids.map(async (id) => {
          const trip = await this.findOneTripById(id);
          if (!trip) {
            return { id: id, message: 'Không tìm thấy tuyến xe' };
          }
          trip.deletedAt = new Date();
          trip.updatedBy = adminExist.id;

          const saveTrip = await this.tripRepository.save(trip);
          return { id: saveTrip.id, message: 'Xoá tuyến xe thành công' };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleTripByCodes(userId: string, dto: TripDeleteMultiInput) {
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
        ids.map(async (code) => {
          const trip = await this.findOneTripByCode(code);
          if (!trip) {
            return { code, message: 'Không tìm thấy tuyến xe' };
          }
          trip.deletedAt = new Date();
          trip.updatedBy = adminExist.id;

          const saveTrip = await this.tripRepository.save(trip);
          return { id: saveTrip.id, message: 'Xoá tuyến xe thành công' };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
