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
import { SortEnum, TripDetailStatusEnum } from './../../enums';
import { Pagination } from './../../decorator';
import { TicketService } from '../ticket/ticket.service';

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

  async findTripDetailById(id: string, options?: any) {
    return await this.tripDetailRepository.findOne({
      where: { id, ...options?.where },
      relations: ['vehicle'].concat(options?.relations || []),
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

  async findTripDetailByCode(code: string, options?: any) {
    return await this.tripDetailRepository.findOne({
      where: { code, ...options?.where },
      relations: ['vehicle'].concat(options?.relations || []),
      select: {
        vehicle: {
          id: true,
          name: true,
          description: true,
          type: true,
          licensePlate: true,
          floorNumber: true,
          totalSeat: true,
        },
        ...options.select,
      },
      ...options,
    });
  }

  async createTripDetail(dto: CreateTripDetailDto, userId: string) {
    const { code, departureTime, expectedTime, status, tripId, vehicleId } =
      dto;

    // check trip details is exist
    const tripDetailExist = await this.findTripDetailByCode(code);
    if (tripDetailExist) {
      throw new BadRequestException('TRIP_DETAIL_CODE_EXIST');
    }

    // create new trip details and validate
    const tripDetail = new TripDetail();
    tripDetail.code = code;
    // check time
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (!departureTime) {
      throw new BadRequestException('DEPARTURE_DATE_REQUIRED');
    }
    if (departureTime <= currentDate) {
      throw new BadRequestException('DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE');
    }
    tripDetail.departureTime = departureTime;
    if (!expectedTime) {
      throw new BadRequestException('EXPECTED_DATE_REQUIRED');
    }
    if (expectedTime <= departureTime) {
      throw new BadRequestException(
        'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
      );
    }
    tripDetail.expectedTime = expectedTime;
    // check status
    if (!status) {
      throw new BadRequestException('TRIP_DETAIL_STATUS_REQUIRED');
    }
    switch (status) {
      case TripDetailStatusEnum.NOT_SOLD_OUT:
      case TripDetailStatusEnum.ACTIVE:
        tripDetail.status = status;
        tripDetail.isActive = true;
        break;
      case TripDetailStatusEnum.INACTIVE:
      case TripDetailStatusEnum.SOLD_OUT:
        tripDetail.status = status;
        tripDetail.isActive = false;
        break;
      default:
        tripDetail.status = TripDetailStatusEnum.INACTIVE;
        tripDetail.isActive = false;
        break;
    }
    // check trip is exist and ref from province, to province
    if (tripId) {
      const trip = await this.dataSource.getRepository(Trip).findOne({
        where: { id: tripId },
        relations: [
          'fromStation.ward.parentCode.parentCode',
          'toStation.ward.parentCode.parentCode',
        ],
      });
      // ref from province and to province
      if (trip) {
        const fromProvince = trip.fromStation.ward.parentCode['parentCode'];
        const toProvince = trip.toStation.ward.parentCode['parentCode'];

        tripDetail.trip = trip;
        tripDetail.fromProvince = fromProvince;
        tripDetail.toProvince = toProvince;
      } else {
        throw new BadRequestException('TRIP_NOT_FOUND');
      }
    } else {
      throw new NotFoundException('TRIP_ID_REQUIRED');
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

    // check permissions
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
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

    // return value
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
      trip: { id: saveTripDetail.trip.id },
      vehicle: { id: saveTripDetail.vehicle.id },
    };
  }

  async findAll(dto: FilterTripDetailDto, pagination?: Pagination) {
    const { status, tripId, fromProvinceCode, toProvinceCode } = dto;
    let { departureTime } = dto;
    const query = this.tripDetailRepository.createQueryBuilder('q');
    query.where('q.isActive = :isActive', { isActive: true });

    const currentDate: Date = new Date(`${new Date().toDateString()}`);
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

  async updateTripDetailById(
    dto: UpdateTripDetailDto,
    id: string,
    userId: string,
  ) {
    const { status, tripId, vehicleId } = dto;
    let { departureTime, expectedTime } = dto;

    const tripDetail = await this.tripDetailRepository.findOne({
      where: { id },
    });
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (departureTime) {
      departureTime = new Date(departureTime);
      if (departureTime >= currentDate) {
        tripDetail.departureTime = departureTime;
      } else {
        throw new BadRequestException(
          'DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
    }
    if (expectedTime) {
      expectedTime = new Date(expectedTime);
      if (
        (departureTime && expectedTime > departureTime) ||
        expectedTime > currentDate
      ) {
        tripDetail.expectedTime = expectedTime;
      } else {
        throw new BadRequestException(
          'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
        );
      }
    }
    if (status) {
      switch (status) {
        case TripDetailStatusEnum.NOT_SOLD_OUT:
        case TripDetailStatusEnum.ACTIVE:
          tripDetail.status = status;
          break;
        case TripDetailStatusEnum.INACTIVE:
        case TripDetailStatusEnum.SOLD_OUT:
          tripDetail.status = status;
          tripDetail.isActive = false;
          break;
        default:
          tripDetail.status = TripDetailStatusEnum.NOT_SOLD_OUT;
          tripDetail.isActive = false;
          break;
      }
    }
    if (tripId) {
      const trip = await this.dataSource
        .getRepository(Trip)
        .findOne({ where: { id: tripId } });
      if (trip) {
        tripDetail.trip = trip;
      } else {
        throw new BadRequestException('TRIP_NOT_FOUND');
      }
    }
    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      if (vehicle) {
        tripDetail.vehicle = vehicle;
      } else {
        throw new BadRequestException('VEHICLE_NOT_FOUND');
      }
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
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
      trip: { id: saveTripDetail.trip.id },
      vehicle: { id: saveTripDetail.vehicle.id },
    };
  }

  async updateTripDetailByCode(
    dto: UpdateTripDetailDto,
    code: string,
    userId: string,
  ) {
    const { status, tripId, vehicleId } = dto;
    let { departureTime, expectedTime } = dto;

    const tripDetail = await this.tripDetailRepository.findOne({
      where: { code },
    });
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (departureTime) {
      departureTime = new Date(departureTime);
      if (departureTime >= currentDate) {
        tripDetail.departureTime = departureTime;
      } else {
        throw new BadRequestException(
          'DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
    }
    if (expectedTime) {
      expectedTime = new Date(expectedTime);
      if (
        (departureTime && expectedTime > departureTime) ||
        expectedTime > currentDate
      ) {
        tripDetail.expectedTime = expectedTime;
      } else {
        throw new BadRequestException(
          'EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE',
        );
      }
    }
    if (status) {
      switch (status) {
        case TripDetailStatusEnum.NOT_SOLD_OUT:
        case TripDetailStatusEnum.ACTIVE:
          tripDetail.status = status;
          break;
        case TripDetailStatusEnum.INACTIVE:
        case TripDetailStatusEnum.SOLD_OUT:
          tripDetail.status = status;
          tripDetail.isActive = false;
          break;
        default:
          tripDetail.status = TripDetailStatusEnum.NOT_SOLD_OUT;
          tripDetail.isActive = false;
          break;
      }
    }
    if (tripId) {
      const trip = await this.dataSource
        .getRepository(Trip)
        .findOne({ where: { id: tripId } });
      if (trip) {
        tripDetail.trip = trip;
      } else {
        throw new BadRequestException('TRIP_NOT_FOUND');
      }
    }
    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      if (vehicle) {
        tripDetail.vehicle = vehicle;
      } else {
        throw new BadRequestException('VEHICLE_NOT_FOUND');
      }
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
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
      trip: { id: saveTripDetail.trip.id },
      vehicle: { id: saveTripDetail.vehicle.id },
    };
  }

  async deleteTripDetailById(id: string, userId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const tripDetail = await this.tripDetailRepository.findOne({
      where: { id },
    });
    if (!tripDetail) {
      throw new BadRequestException('TRIP_DETAIL_NOT_FOUND');
    }
    tripDetail.deletedAt = new Date();
    tripDetail.updatedBy = adminExist.id;

    return await { id: (await this.tripDetailRepository.save(tripDetail)).id };
  }

  async deleteTripDetailByCode(code: string, userId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const tripDetail = await this.tripDetailRepository.findOne({
      where: { code },
    });
    if (!tripDetail) {
      throw new BadRequestException('TRIP_DETAIL_NOT_FOUND');
    }
    tripDetail.deletedAt = new Date();
    tripDetail.updatedBy = adminExist.id;

    return await { id: (await this.tripDetailRepository.save(tripDetail)).id };
  }

  async deleteMultipleTripDetailByIds(
    userId: string,
    dto: TripDetailDeleteMultiInput,
  ) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deleteTripDetailById(id, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleTripDetailByCodes(
    userId: string,
    dto: TripDetailDeleteMultiInput,
  ) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(
          async (code) => await this.deleteTripDetailByCode(code, userId),
        ),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
