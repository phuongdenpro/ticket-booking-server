import { SaveTripDto, FilterTripDto, UpdateTripDto } from './dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, Station, Trip } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { SortEnum, TripStatusEnum } from 'src/enums';
import { Pagination } from 'src/decorator';
import { TripDeleteMultiInput } from './dto/delete-multiple-input-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripService: Repository<Trip>,
    // private tripDetailService: TripDetailService,
    private dataSource: DataSource,
  ) {}
  private tripSelect = [
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

  async saveTrip(dto: SaveTripDto, userId: string) {
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
      throw new UnauthorizedException();
    }

    const trip = new Trip();
    if (!name) {
      throw new BadRequestException('Name is required');
    }
    trip.name = name;
    trip.note = note;
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate < currentDate) {
      throw new BadRequestException('Start date must be greater than now');
    }
    trip.startDate = startDate;

    if (endDate) {
      if (endDate < currentDate && endDate < startDate) {
        throw new BadRequestException(
          'End date must be greater than start date',
        );
      } else {
        trip.endDate = endDate;
      }
    }

    const fromStation = await this.dataSource
      .getRepository(Station)
      .findOne({ where: { id: fromStationId } });
    if (!fromStation) {
      throw new BadRequestException('From station not found');
    }
    trip.fromStation = fromStation;

    const toStation = await this.dataSource
      .getRepository(Station)
      .findOne({ where: { id: toStationId } });
    if (!toStation) {
      throw new BadRequestException('To station not found');
    }
    trip.toStation = toStation;
    if (fromStationId === toStationId) {
      throw new BadRequestException('From station and to station must be diff');
    }

    if (isActive === undefined || isActive === null) {
      trip.isActive = true;
    } else {
      trip.isActive = TripStatusEnum.ACTIVE === isActive;
    }

    trip.createdBy = adminExist.id;
    const saveTrip = await this.tripService.save(trip);
    return {
      id: saveTrip.id,
      name: saveTrip.name,
      note: saveTrip.note,
      startDate: saveTrip.startDate,
      endDate: saveTrip.endDate,
      isActive: saveTrip.isActive,
      createdBy: saveTrip.createdBy,
      updatedBy: saveTrip.updatedBy,
      createdAt: saveTrip.createdAt,
      updatedAt: saveTrip.updatedAt,
      fromStation: {
        id: saveTrip.fromStation.id,
        name: saveTrip.fromStation.name,
      },
      toStation: {
        id: saveTrip.toStation.id,
        name: saveTrip.toStation.name,
      },
    };
  }

  async findAllTrip(dto: FilterTripDto, pagination?: Pagination) {
    const { name, fromStationId, toStationId } = dto;
    let { startDate, endDate } = dto;
    const query = this.tripService.createQueryBuilder('q');

    if (name) {
      query.andWhere('q.name like :name', { name: `%${name}%` });
    }

    const currentDate: Date = new Date(`${new Date().toDateString()}`);
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
      .select(this.tripSelect)
      .orderBy('q.createdAt', SortEnum.ASC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    // const newDataResult = [];
    // if (departureTime) {
    //   departureTime = new Date(departureTime);
    //   // find trip detail and add to trip list
    //   await Promise.all(
    //     dataResult.map(async (trip) => {
    //       const dto = new FilterTripDetailDto();
    //       dto.departureTime = departureTime;
    //       dto.tripId = trip.id;
    //       const tripDetailDataResult = await this.tripDetailService.findAll(
    //         dto,
    //         {
    //           page: 1,
    //           pageSize: 100,
    //         },
    //       );
    //       trip.tripDetails = tripDetailDataResult.dataResult;
    //       newDataResult.push(trip);
    //     }),
    //   );
    // }

    return { dataResult, pagination, total };
  }

  async findOneTripById(id: string) {
    const query = this.tripService.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query
      .andWhere('q.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('q.fromStation', 'fs')
      .leftJoinAndSelect('q.toStation', 'to')
      .select(this.tripSelect)
      .getOne();

    return { dataResult };
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
      throw new UnauthorizedException();
    }

    const trip = await this.tripService.findOne({ where: { id } });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    if (name) {
      trip.name = name;
    }
    if (note) {
      trip.note = note;
    }

    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate !== undefined || startDate !== null) {
      if (startDate < currentDate) {
        throw new BadRequestException('Start date must be greater than now');
      }
      trip.startDate = startDate;
    }
    if (endDate !== undefined || endDate !== null) {
      if (endDate < currentDate) {
        throw new BadRequestException('End date must be greater than now');
      }
      trip.endDate = endDate;
    }

    if (fromStationId) {
      const fromStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: fromStationId } });
      if (!fromStation) {
        throw new BadRequestException('From station not found');
      }
      trip.fromStation = fromStation;
    }
    if (toStationId) {
      const toStation = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: toStationId } });
      if (!toStation) {
        throw new BadRequestException('To station not found');
      }
      trip.toStation = toStation;
    }
    if (fromStationId === toStationId) {
      throw new BadRequestException(
        'From station and to station must be different',
      );
    }
    if (isActive) {
      trip.isActive = TripStatusEnum.ACTIVE === isActive;
    }
    trip.updatedBy = adminExist.id;

    const updateTrip = await this.tripService.save(trip);
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

  async deleteTripById(id: string, userId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const trip = await this.tripService.findOne({ where: { id } });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    trip.deletedAt = new Date();
    trip.updatedBy = adminExist.id;

    return await (
      await this.tripService.save(trip)
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
}
