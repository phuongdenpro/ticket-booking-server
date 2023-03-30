import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, Trip, TripDetail, Vehicle } from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import {
  CreateTripDetailDto,
  TripDetailDeleteMultiInput,
  UpdateTripDetailDto,
  FilterTripDetailDto,
} from './dto';
import {
  DeleteDtoTypeEnum,
  SortEnum,
  TripDetailStatusEnum,
} from './../../enums';
import { Pagination } from './../../decorator';
import { TicketService } from '../ticket/ticket.service';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class TripDetailService {
  constructor(
    @InjectRepository(TripDetail)
    private readonly tripDetailRepository: Repository<TripDetail>,
    private readonly ticketService: TicketService,
    private dataSource: DataSource,
  ) {}

  private tripDetailSelect = [
    'q',
    'v.id',
    'v.name',
    'v.description',
    'v.type',
    'v.licensePlate',
    'v.floorNumber',
    'v.totalSeat',
  ];

  async findOneTripDetail(options: any) {
    return await this.tripDetailRepository.findOne({
      where: { ...options?.where },
      relations: {
        vehicle: true,
        ...options?.relations,
      },
      select: {
        deletedAt: false,
        vehicle: {
          id: true,
          name: true,
          description: true,
          type: true,
          licensePlate: true,
          floorNumber: true,
          totalSeat: true,
        },
        ...options?.select,
      },
      ...options.other,
    });
  }

  async findTripDetailById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneTripDetail(options);
  }

  async findTripDetailByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneTripDetail(options);
  }

  async findAll(dto: FilterTripDetailDto, pagination?: Pagination) {
    const { status, tripId, fromProvinceCode, toProvinceCode } = dto;
    let { departureTime } = dto;
    const query = this.tripDetailRepository.createQueryBuilder('q');
    query.where('q.isActive = :isActive', { isActive: true });

    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (departureTime) {
      departureTime = new Date(`${departureTime.toDateString()}`);
      const departureTime1 = new Date(`${departureTime.toDateString()}`);
      departureTime1.setDate(departureTime1.getDate() + 1);

      if (departureTime >= currentDate) {
        query
          .andWhere('q.departureTime >= :departureTime', { departureTime })
          .andWhere('q.departureTime <= :departureTime1', { departureTime1 });
      }
    }
    if (status) {
      query.andWhere('q.status = :status', { status });
    } else {
      query.andWhere('q.status = :status', {
        status: TripDetailStatusEnum.NOT_SOLD_OUT,
      });
    }
    if (tripId) {
      const trip = await this.dataSource.getRepository(Trip).findOne({
        where: { id: tripId },
      });
      if (!trip) {
        throw new BadRequestException('TRIP_NOT_FOUND');
      }
      query.andWhere('q.trip_id = :tripId', { tripId: trip.id });
    }
    if (fromProvinceCode) {
      query.leftJoinAndSelect('q.fromProvince', 'fp');
      query.andWhere('fp.code = :fromProvinceCode', {
        fromProvinceCode,
      });
    }
    if (toProvinceCode) {
      query.leftJoinAndSelect('q.toProvince', 'tp');
      query.andWhere('tp.code = :toProvinceCode', { toProvinceCode });
    }

    const total = await query.getCount();
    const dataResult = await query
      .leftJoinAndSelect('q.vehicle', 'v')
      .select(this.tripDetailSelect)
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getTripDetailById(id: string, options?: any) {
    const tripDetail = await this.findTripDetailById(id, options);
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    return tripDetail;
  }

  async getTripDetailByCode(code: string) {
    const tripDetail = await this.findTripDetailByCode(code);
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    return tripDetail;
  }

  async createTripDetail(dto: CreateTripDetailDto, userId: string) {
    const {
      code,
      departureTime,
      expectedTime,
      status,
      tripId,
      tripCode,
      vehicleId,
    } = dto;

    // check trip detail code is exist
    const tripDetailExist = await this.findTripDetailByCode(code);
    if (tripDetailExist) {
      throw new BadRequestException('TRIP_DETAIL_CODE_EXIST');
    }

    // create new trip details and validate
    const tripDetail = new TripDetail();
    tripDetail.code = code;
    let trip: Trip;
    const relations = {
      fromStation: { ward: { district: { province: true } } },
      toStation: { ward: { district: { province: true } } },
    };
    // check trip is exist and ref from province, to province
    if (!tripId && !tripCode) {
      throw new NotFoundException('TRIP_ID_OR_CODE_REQUIRED');
    }
    if (tripId) {
      trip = await this.dataSource.getRepository(Trip).findOne({
        where: { id: tripId },
        relations,
      });
    } else {
      trip = await this.dataSource.getRepository(Trip).findOne({
        where: { code: tripCode },
        relations,
      });
    }
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    const fromProvince = trip.fromStation.ward.district.province;
    const toProvince = trip.toStation.ward.district.province;
    tripDetail.trip = trip;
    tripDetail.fromProvince = fromProvince;
    tripDetail.toProvince = toProvince;

    // valid departure time
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (trip.endDate < currentDate) {
      throw new BadRequestException('TRIP_HAS_ENDED');
    }

    if (!departureTime) {
      throw new BadRequestException('DEPARTURE_TIME_REQUIRED');
    }
    if (departureTime <= currentDate) {
      throw new BadRequestException('DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE');
    }
    if (departureTime < trip.startDate) {
      throw new BadRequestException(
        'DEPARTURE_DATE_GREATER_THAN_OR_EQUAL_TO_TRIP_START_DATE',
      );
    }
    if (departureTime > trip.endDate) {
      throw new BadRequestException(
        'DEPARTURE_DATE_LESS_THAN_OR_EQUAL_TO_TRIP_END_DATE',
      );
    }
    tripDetail.departureTime = departureTime;

    if (!expectedTime) {
      throw new BadRequestException('EXPECTED_TIME_REQUIRED');
    }
    if (expectedTime <= currentDate) {
      throw new BadRequestException('EXPECTED_DATE_GREATER_THAN_CURRENT_DATE');
    }
    if (expectedTime <= departureTime) {
      throw new BadRequestException(
        'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
      );
    }
    if (expectedTime < trip.startDate) {
      throw new BadRequestException(
        'EXPECTED_DATE_GREATER_THAN_OR_EQUAL_TO_TRIP_START_DATE',
      );
    }
    tripDetail.expectedTime = expectedTime;

    // check status
    switch (status) {
      case TripDetailStatusEnum.NOT_SOLD_OUT:
      case TripDetailStatusEnum.ACTIVE:
      case TripDetailStatusEnum.SOLD_OUT:
        tripDetail.status = status;
        break;
      default:
        tripDetail.status = TripDetailStatusEnum.INACTIVE;
        break;
    }
    // check vehicle
    if (!vehicleId) {
      throw new NotFoundException('VEHICLE_ID_REQUIRED');
    }
    const vehicle = await this.dataSource
      .getRepository(Vehicle)
      .findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('VEHICLE_NOT_FOUND');
    }
    tripDetail.vehicle = vehicle;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    tripDetail.createdBy = adminExist.id;

    const saveTripDetail = await this.tripDetailRepository.save(tripDetail);
    // create ticket
    await this.ticketService.createTicket(
      {
        code: saveTripDetail.code,
        note: '',
        startDate: new Date(),
        endDate: departureTime,
        tripDetailId: saveTripDetail.id,
      },
      adminExist.id,
    );

    return {
      id: saveTripDetail.id,
      departureTime: saveTripDetail.departureTime,
      expectedTime: saveTripDetail.expectedTime,
      status: saveTripDetail.status,
      createdBy: saveTripDetail.createdBy,
      updatedBy: saveTripDetail.updatedBy,
      createdAt: saveTripDetail.createdAt,
      updatedAt: saveTripDetail.updatedAt,
      isActive: saveTripDetail.isActive,
      trip: { id: trip.id },
      vehicle: { id: vehicle.id },
    };
  }

  async updateTripDetailByIdOrCode(
    dto: UpdateTripDetailDto,
    userId: string,
    id?: string,
    code?: string,
  ) {
    const { status, vehicleId, departureTime, expectedTime } = dto;

    let tripDetail: TripDetail;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    if (id) {
      tripDetail = await this.findTripDetailById(id, {
        relations: { trip: true },
      });
    } else {
      tripDetail = await this.findTripDetailByCode(code, {
        relations: { trip: true },
      });
    }
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }

    const trip: Trip = tripDetail.trip;
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (trip.endDate < currentDate) {
      throw new BadRequestException('TRIP_HAS_ENDED');
    }

    if (departureTime) {
      if (departureTime <= currentDate) {
        throw new BadRequestException(
          'DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
      if (departureTime < trip.startDate) {
        throw new BadRequestException(
          'DEPARTURE_DATE_GREATER_THAN_OR_EQUAL_TO_TRIP_START_DATE',
        );
      }
      if (departureTime > trip.endDate) {
        throw new BadRequestException(
          'DEPARTURE_DATE_LESS_THAN_OR_EQUAL_TO_TRIP_END_DATE',
        );
      }
      if (
        (expectedTime && departureTime >= expectedTime) ||
        (!expectedTime && departureTime >= tripDetail.expectedTime)
      ) {
        throw new BadRequestException(
          'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
        );
      }
      tripDetail.departureTime = departureTime;
    }
    if (expectedTime) {
      if (expectedTime <= currentDate) {
        throw new BadRequestException(
          'DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
      if (expectedTime < trip.startDate) {
        throw new BadRequestException(
          'EXPECTED_DATE_GREATER_THAN_OR_EQUAL_TO_TRIP_START_DATE',
        );
      }
      if (
        (departureTime && expectedTime <= departureTime) ||
        (!departureTime && expectedTime <= tripDetail.departureTime)
      ) {
        throw new BadRequestException(
          'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
        );
      }
      tripDetail.expectedTime = expectedTime;
    }
    if (status) {
      switch (status) {
        case TripDetailStatusEnum.NOT_SOLD_OUT:
        case TripDetailStatusEnum.ACTIVE:
        case TripDetailStatusEnum.INACTIVE:
        case TripDetailStatusEnum.SOLD_OUT:
          tripDetail.status = status;
          break;
        default:
          break;
      }
    }

    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      if (!vehicle) {
        throw new BadRequestException('VEHICLE_NOT_FOUND');
      }
      tripDetail.vehicle = vehicle;
    }
    // check permissions
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    tripDetail.updatedBy = adminExist.id;

    const saveTripDetail = await this.tripDetailRepository.save(tripDetail);
    return {
      id: saveTripDetail.id,
      departureTime: saveTripDetail.departureTime,
      expectedTime: saveTripDetail.expectedTime,
      status: saveTripDetail.status,
      createdBy: saveTripDetail.createdBy,
      updatedBy: saveTripDetail.updatedBy,
      createdAt: saveTripDetail.createdAt,
      updatedAt: saveTripDetail.updatedAt,
      isActive: saveTripDetail.isActive,
      trip: { id: tripDetail.trip.id },
      vehicle: { id: tripDetail.vehicle.id },
    };
  }

  async deleteTripDetailByIdOrCode(userId: string, id?: string, code?: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }

    let tripDetail: TripDetail;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    if (id) {
      tripDetail = await this.findTripDetailById(id);
    } else {
      tripDetail = await this.findTripDetailByCode(code);
    }
    if (!tripDetail) {
      throw new BadRequestException('TRIP_DETAIL_NOT_FOUND');
    }
    tripDetail.deletedAt = new Date();
    tripDetail.updatedBy = adminExist.id;
    const saveTripDetail = await this.tripDetailRepository.save(tripDetail);

    return await {
      id: saveTripDetail.id,
      code: saveTripDetail.code,
      message: 'Xoá thành công',
    };
  }

  async deleteMultipleTripDetailByIdsOrCodes(
    userId: string,
    dto: TripDetailDeleteMultiInput,
    type: DeleteDtoTypeEnum,
  ) {
    try {
      const { ids } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!adminExist) {
        throw new UnauthorizedException('USER_NOT_FOUND');
      }
      if (!adminExist.isActive) {
        throw new UnauthorizedException('USER_NOT_ACTIVE');
      }

      const list = await Promise.all(
        ids.map(async (data) => {
          if (!data) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: `${type} không được để trống`,
            };
          }
          let tripDetail: TripDetail;
          if (type === DeleteDtoTypeEnum.ID) {
            tripDetail = await this.findTripDetailById(data);
          } else if (type === DeleteDtoTypeEnum.CODE) {
            tripDetail = await this.findTripDetailByCode(data);
          }
          if (!tripDetail) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: 'TRIP_DETAIL_NOT_FOUND',
            };
          }
          tripDetail.deletedAt = new Date();
          tripDetail.updatedBy = adminExist.id;
          const saveTripDetail = await this.tripDetailRepository.save(
            tripDetail,
          );
          return {
            id: saveTripDetail.id,
            code: saveTripDetail.code,
            message: 'Xoá thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
