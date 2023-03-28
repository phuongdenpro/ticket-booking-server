import {
  ActiveStatusEnum,
  DeleteDtoTypeEnum,
  SortEnum,
  VehicleTypeEnum,
} from './../../enums';
import {
  CreatePriceListDto,
  FilterPriceListDto,
  UpdatePriceListDto,
  DeletePriceListDto,
  CreatePriceDetailDto,
  FilterPriceDetailDto,
  UpdatePriceDetailDto,
  DeletePriceDetailDto,
} from './dto';
import { PriceDetail, PriceList, Staff, Trip } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from './../../decorator';
import {
  DataSource,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepository: Repository<PriceList>,
    @InjectRepository(PriceDetail)
    private readonly priceDetailRepository: Repository<PriceDetail>,
    private dataSource: DataSource,
  ) {}

  private selectFieldsPriceDetailWithQ = [
    'q.id',
    'q.code',
    'q.price',
    'q.note',
    'q.createdBy',
    'q.updatedBy',
    'q.createdAt',
    'q.updatedAt',
    't.id',
    't.code',
    't.name',
    't.description',
    't.note',
    't.createdBy',
    't.createdAt',
  ];

  private selectFieldsPriceListWithQ = [
    'q.id',
    'q.code',
    'q.name',
    'q.note',
    'q.startDate',
    'q.endDate',
    'q.status',
    'q.createdAt',
    'q.updatedAt',
    'q.createdBy',
    'q.updatedBy',
  ];

  // price list
  async findOnePriceList(options?: any) {
    const priceList = await this.priceListRepository.findOne({
      where: { ...options?.where },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      relations: {
        ...options?.relations,
      },
      order: { createdAt: SortEnum.DESC, ...options?.order },
      ...options?.other,
    });
    return priceList;
  }

  async findOnePriceListById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return this.findOnePriceList(options);
  }

  async findOnePriceListByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return this.findOnePriceList(options);
  }

  async getPriceListById(id: string, options?: any) {
    const priceList = await this.findOnePriceListById(id, options);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    return priceList;
  }

  async getPriceListByCode(code: string, options?: any) {
    const priceList = await this.findOnePriceListByCode(code, options);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    return priceList;
  }

  async createPriceList(dto: CreatePriceListDto, adminId: string) {
    const { code, name, note, startDate, endDate, status } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceListCodeExist = await this.findOnePriceListByCode(code, {
      other: {
        withDeleted: true,
      },
    });
    if (priceListCodeExist) {
      throw new BadRequestException('PRICE_LIST_CODE_IS_EXIST');
    }
    const priceListStartDateExist = await this.findOnePriceList({
      where: {
        startDate: MoreThanOrEqual(startDate),
        endDate: LessThanOrEqual(startDate),
      },
    });
    const priceListEndDateExist = await this.findOnePriceList({
      where: {
        startDate: MoreThanOrEqual(endDate),
        endDate: LessThanOrEqual(endDate),
      },
    });
    if (priceListStartDateExist || priceListEndDateExist) {
      let code;
      if (priceListStartDateExist) {
        code = priceListStartDateExist.code;
      } else {
        code = priceListEndDateExist.code;
      }
      throw new BadRequestException(
        'ANOTHER_PRICE_LIST_IS_EXIST_IN_THIS_DATE',
        {
          description: `Bảng giá có mã ${code} đã tồn tại trong khoảng thời gian này`,
        },
      );
    }

    const priceList = new PriceList();
    if (!name) {
      throw new BadRequestException('NAME_IS_REQUIRED');
    }
    priceList.code = code;
    priceList.name = name;
    priceList.note = note;
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
        priceList.status = ActiveStatusEnum.ACTIVE;
        break;
      default:
        priceList.status = ActiveStatusEnum.INACTIVE;
        break;
    }
    priceList.createdBy = adminExist.id;

    if (!startDate) {
      throw new BadRequestException('START_DATE_IS_REQUIRED');
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate <= currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    priceList.startDate = startDate;
    if (!endDate) {
      throw new BadRequestException('END_DATE_IS_REQUIRED');
    }
    if (endDate < currentDate) {
      throw new BadRequestException(
        'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_NOW',
      );
    }
    if (startDate > endDate) {
      throw new BadRequestException('START_DATE_MUST_BE_LESS_THAN_END_DATE');
    }
    priceList.endDate = endDate;

    const savePriceList = await this.priceListRepository.save(priceList);
    delete savePriceList.deletedAt;
    return savePriceList;
  }

  async findAllPriceList(dto: FilterPriceListDto, pagination?: Pagination) {
    const { keywords, startDate, endDate, status, sort } = dto;

    const query = this.priceListRepository.createQueryBuilder('q');
    if (keywords) {
      const newKeywords = keywords.trim();
      const subQuery = this.priceListRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('q2.name LIKE :name', { name: `%${newKeywords}%` })
        .orWhere('q2.note LIKE :note', { note: `%${newKeywords}%` })
        .getQuery();

      query.andWhere(`EXISTS ${subQuery}`, {});
    }
    if (status) {
      query.where('q.status = :status', { status });
    }
    if (startDate) {
      const newStartDate = new Date(startDate);
      query.andWhere('q.startDate >= :startDate', { startDate: newStartDate });
    }
    if (endDate) {
      const newEndDate = new Date(endDate);
      query.andWhere('q.endDate <= :endDate', { endDate: newEndDate });
    }
    query.orderBy('q.createdAt', sort || SortEnum.DESC);

    const dataResult = await query
      .select(this.selectFieldsPriceListWithQ)
      .offset(pagination.skip ?? 0)
      .limit(pagination.take ?? 10)
      .getMany();
    const total = await query.clone().getCount();

    return { dataResult, total, pagination };
  }

  async updatePriceListByIdOrCode(
    adminId: string,
    dto: UpdatePriceListDto,
    id?: string,
    code?: string,
  ) {
    const { name, note, startDate, endDate, status } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    let priceList: PriceList;
    if (id) {
      priceList = await this.findOnePriceListById(id);
    } else if (code) {
      priceList = await this.findOnePriceListByCode(code);
    }
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (priceList.endDate <= currentDate) {
      throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
    }
    if (name) {
      priceList.name = name;
    }
    if (note) {
      priceList.note = note;
    }

    if (startDate) {
      if (startDate !== priceList.startDate) {
        const priceListStartDateExist = await this.findOnePriceList({
          where: {
            startDate: MoreThanOrEqual(startDate),
            endDate: LessThanOrEqual(startDate),
          },
        });
        if (priceListStartDateExist) {
          const code = priceListStartDateExist.code;
          throw new BadRequestException(
            'ANOTHER_PRICE_LIST_IS_EXIST_IN_THIS_DATE',
            {
              description: `Bảng giá có mã ${code} đã tồn tại trong khoảng thời gian này`,
            },
          );
        }
        if (startDate <= currentDate) {
          throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
        }
        if (!endDate && startDate >= priceList.endDate) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE',
          );
        }
        if (
          priceList.status === ActiveStatusEnum.ACTIVE &&
          currentDate >= priceList.startDate &&
          currentDate <= priceList.endDate
        ) {
          throw new BadRequestException('PRICE_LIST_IS_ACTIVE_AND_IN_USE');
        }
        priceList.startDate = startDate;
      }
    }
    if (endDate) {
      if (endDate !== priceList.endDate) {
        if (endDate < currentDate) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_NOW',
          );
        }
        if (
          (!startDate && priceList.startDate > endDate) ||
          (startDate && startDate > endDate)
        ) {
          throw new BadRequestException(
            'END_DATE_MUST_BE_GREATER_THAN_START_DATE',
          );
        }
        const priceListEndDateExist = await this.findOnePriceList({
          where: {
            startDate: MoreThanOrEqual(endDate),
            endDate: LessThanOrEqual(endDate),
          },
        });
        if (priceListEndDateExist) {
          const code = priceListEndDateExist.code;
          throw new BadRequestException(
            'ANOTHER_PRICE_LIST_IS_EXIST_IN_THIS_DATE',
            {
              description: `Bảng giá có mã ${code} đã tồn tại trong khoảng thời gian này`,
            },
          );
        }
        priceList.endDate = endDate;
      }
    }
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
      case ActiveStatusEnum.INACTIVE:
        priceList.status = status;
        break;
      default:
        break;
    }

    priceList.updatedBy = adminExist.id;
    const updateTrip = await this.priceListRepository.save(priceList);
    delete updateTrip.deletedAt;
    return updateTrip;
  }

  async deletePriceListByIdOrCode(adminId: string, id?: string, code?: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    let priceList: PriceList;
    if (id) {
      priceList = await this.findOnePriceListById(id);
    } else if (code) {
      priceList = await this.findOnePriceListByCode(id);
    }
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (priceList.endDate <= currentDate) {
      throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
    }
    priceList.updatedBy = adminExist.id;

    await this.priceListRepository.delete(priceList);
    return {
      id: priceList.id,
      code: priceList.code,
      message: 'Xoá thành công',
    };
  }

  async deleteMultiPriceListByIdsOrCodes(
    adminId: string,
    dto: DeletePriceListDto,
    type: string,
  ) {
    try {
      const { ids } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: adminId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const list = await Promise.all(
        ids.map(async (data) => {
          let priceList: PriceList;
          if (type === 'id') {
            priceList = await this.findOnePriceListById(data);
          } else if (type === 'code') {
            priceList = await this.findOnePriceListByCode(data);
          }
          if (!priceList) {
            return {
              id: type === 'id' ? priceList.id : undefined,
              code: type === 'code' ? priceList.code : undefined,
              message: 'Không tìm thấy bảng giá',
            };
          }
          const currentDate = new Date(moment().format('YYYY-MM-DD'));
          if (priceList.endDate <= currentDate) {
            throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
          }
          priceList.updatedBy = adminExist.id;

          await this.priceListRepository.delete(priceList);
          return {
            id: priceList.id,
            code: priceList.code,
            message: 'Xoá thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // price detail
  async findOnePriceDetail(options: any) {
    return await this.priceDetailRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
      select: { ...options?.select },
      order: { createdAt: SortEnum.DESC, ...options?.order },
      ...options?.other,
    });
  }

  async findOnePriceDetailById(id: string, options?: any) {
    if (options) {
      options.where = { id: id, ...options?.where };
    } else {
      options = { where: { id: id } };
    }
    return await this.findOnePriceDetail(options);
  }

  async findOnePriceDetailByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOnePriceDetail(options);
  }

  async createPriceDetail(dto: CreatePriceDetailDto, adminId: string) {
    const {
      code,
      price,
      note,
      priceListId,
      priceListCode,
      tripCode,
      seatType,
    } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceDetailCodeExist = await this.findOnePriceDetailByCode(code);
    if (priceDetailCodeExist) {
      throw new BadRequestException('PRICE_DETAIL_CODE_EXISTED');
    }

    if (!priceListId && !priceListCode) {
      throw new BadRequestException('PRICE_LIST_ID_OR_CODE_REQUIRED');
    }
    let priceList: PriceList;
    if (priceListId) {
      priceList = await this.findOnePriceListById(priceListId);
    } else {
      priceList = await this.findOnePriceListByCode(priceListCode);
    }
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (priceList.endDate <= currentDate) {
      throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
    }

    const priceDetail = new PriceDetail();
    priceDetail.priceList = priceList;

    const trip = await this.dataSource.getRepository(Trip).findOne({
      where: { code: tripCode },
    });
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    priceDetail.trip = trip;

    switch (seatType) {
      case VehicleTypeEnum.LIMOUSINE:
      case VehicleTypeEnum.SEAT_BUS:
      case VehicleTypeEnum.SLEEPER_BUS:
        priceDetail.seatType = seatType;
        break;
      default:
        throw new BadRequestException('SEAT_TYPE_NOT_FOUND');
    }

    const priceDetailStartDateExist = await this.findOnePriceDetail({
      where: {
        seatType,
        priceList: {
          startDate: LessThanOrEqual(priceList.startDate),
          endDate: MoreThanOrEqual(priceList.startDate),
          status: ActiveStatusEnum.ACTIVE,
        },
        trip: {
          code: tripCode,
        },
      },
      relations: {
        priceList: true,
        trip: true,
      },
    });
    if (priceDetailStartDateExist) {
      const priceList: PriceList = priceDetailStartDateExist.priceList;
      throw new BadRequestException('TRIP_EXISTED_IN_PRICE_LIST', {
        description: `Loại ghế của tuyến "${trip?.name}" đã tồn tại trong bảng giá đang học động khác có mã ${priceList?.code}`,
      });
    }
    const priceDetailEndDateExist = await this.findOnePriceDetail({
      where: {
        seatType,
        priceList: {
          startDate: LessThanOrEqual(priceList.endDate),
          endDate: MoreThanOrEqual(priceList.endDate),
          status: ActiveStatusEnum.ACTIVE,
        },
        trip: {
          code: tripCode,
        },
      },
      relations: {
        priceList: true,
        trip: true,
      },
    });
    if (priceDetailEndDateExist) {
      const priceList: PriceList = priceDetailEndDateExist.priceList;
      throw new BadRequestException('TRIP_EXISTED_IN_PRICE_LIST', {
        description: `Loại ghế của tuyến "${trip?.name}" đã tồn tại trong bảng giá đang học động khác có mã ${priceList?.code}`,
      });
    }

    const priceDetailExist = await this.findOnePriceDetailByCode(code);
    if (priceDetailExist) {
      throw new BadRequestException('PRICE_DETAIL_CODE_EXISTED');
    }
    priceDetail.code = code;

    if (price < 0 || isNaN(price)) {
      throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
    }
    priceDetail.price = price;
    priceDetail.note = note;
    priceDetail.createdBy = adminExist.id;

    const savePriceDetail = await this.priceDetailRepository.save(priceDetail);
    delete savePriceDetail.deletedAt;
    return savePriceDetail;
  }

  async getPriceDetailById(id: string, options?: any) {
    const priceDetail = await this.findOnePriceDetailById(id, options);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    return priceDetail;
  }

  async getPriceDetailByCode(code: string, options?: any) {
    console.log('options', options);
    const priceDetail = await this.findOnePriceDetailByCode(code, options);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    return priceDetail;
  }

  async findAllPriceDetail(dto: FilterPriceDetailDto, pagination?: Pagination) {
    const { price, keywords, priceListCode, sort, seatType } = dto;
    const query = this.priceDetailRepository.createQueryBuilder('q');

    if (keywords) {
      const subQuery = this.priceDetailRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${keywords}%` })
        .orWhere('q2.note LIKE :note', { note: `%${keywords}%` })
        .getQuery();

      query.andWhere(`EXISTS ${subQuery}`, {});
    }
    if (price) {
      query.andWhere('q.price <= :price', { price });
    }
    if (priceListCode) {
      query
        .leftJoinAndSelect('q.priceList', 'p')
        .andWhere('p.code = :priceListCode', { priceListCode });
    }
    switch (seatType) {
      case VehicleTypeEnum.LIMOUSINE:
      case VehicleTypeEnum.SLEEPER_BUS:
      case VehicleTypeEnum.SEAT_BUS:
        query.andWhere('q.seatType = :seatType', { seatType });
        break;
      default:
        break;
    }
    query
      .orderBy('q.price', sort || SortEnum.ASC)
      .addOrderBy('q.code', sort || SortEnum.DESC)
      .addOrderBy('q.note', sort || SortEnum.DESC);

    const dataResult = await query
      .leftJoinAndSelect('q.ticketGroup', 't')
      .select(this.selectFieldsPriceDetailWithQ)
      .skip(pagination.skip)
      .take(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    return { dataResult, pagination, total };
  }

  async updatePriceDetailByIdOrCode(
    adminId: string,
    dto: UpdatePriceDetailDto,
    id?: string,
    code?: string,
  ) {
    const { price, note, tripCode, seatType } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    let priceDetail;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_IS_REQUIRED');
    }
    if (id) {
      priceDetail = await this.getPriceDetailById(id, {
        relations: {
          priceList: true,
          trip: true,
        },
      });
    } else if (code) {
      priceDetail = await this.getPriceDetailByCode(code, {
        relations: {
          priceList: true,
          trip: true,
        },
      });
    }
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    const priceList: PriceList = priceDetail.priceList;

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (priceList.endDate <= currentDate) {
      throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
    }
    if (
      priceList.status === ActiveStatusEnum.ACTIVE &&
      currentDate >= priceList.startDate &&
      currentDate <= priceList.endDate
    ) {
      throw new BadRequestException('PRICE_LIST_IS_ACTIVE_AND_IN_USE');
    }

    switch (seatType) {
      case VehicleTypeEnum.LIMOUSINE:
      case VehicleTypeEnum.SEAT_BUS:
      case VehicleTypeEnum.SLEEPER_BUS:
        priceDetail.seatType = seatType;
        break;
      default:
        throw new BadRequestException('SEAT_TYPE_NOT_FOUND');
    }
    if (tripCode) {
      const trip = await this.dataSource.getRepository(Trip).findOne({
        where: { code: tripCode },
      });
      if (!trip) {
        throw new BadRequestException('TRIP_NOT_FOUND');
      }
      priceDetail.trip = trip;
    }

    const priceDetailStartDateExist = await this.findOnePriceDetail({
      where: {
        seatType,
        priceList: {
          startDate: LessThanOrEqual(priceList.startDate),
          endDate: MoreThanOrEqual(priceList.startDate),
          status: ActiveStatusEnum.ACTIVE,
        },
        trip: {
          code: tripCode,
        },
      },
      relations: {
        priceList: true,
        trip: true,
      },
    });
    if (priceDetailStartDateExist) {
      const priceList: PriceList = priceDetailStartDateExist.priceList;
      throw new BadRequestException('TRIP_EXISTED_IN_PRICE_LIST', {
        description: `Loại ghế của tuyến "${priceDetail.trip?.name}" đã tồn tại trong bảng giá đang kích hoạt có mã ${priceList?.code}`,
      });
    }
    const priceDetailEndDateExist = await this.findOnePriceDetail({
      where: {
        seatType,
        priceList: {
          startDate: LessThanOrEqual(priceList.endDate),
          endDate: MoreThanOrEqual(priceList.endDate),
          status: ActiveStatusEnum.ACTIVE,
        },
        trip: {
          code: tripCode,
        },
      },
      relations: {
        priceList: true,
        trip: true,
      },
    });
    if (priceDetailEndDateExist) {
      const priceList: PriceList = priceDetailEndDateExist.priceList;
      throw new BadRequestException('TRIP_EXISTED_IN_PRICE_LIST', {
        description: `Loại ghế của tuyến "${priceDetail.trip?.name}" đã tồn tại trong bảng giá đang kích hoạt có mã ${priceList?.code}`,
      });
    }

    if (price) {
      if (price < 0 || isNaN(price)) {
        throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
      }
      if (price > Number.MAX_VALUE) {
        throw new BadRequestException('PRICE_IS_TOO_BIG');
      }
      priceDetail.price = price;
    }
    if (note) {
      priceDetail.note = note;
    }
    priceDetail.updatedBy = adminExist.id;

    const updatePriceDetail = await this.priceDetailRepository.save(
      priceDetail,
    );
    delete updatePriceDetail.deletedAt;
    return updatePriceDetail;
  }

  async deletePriceDetailByIdOrCode(
    adminId: string,
    id?: string,
    code?: string,
  ) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    let priceDetail: PriceDetail;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_IS_REQUIRED');
    }
    if (id) {
      priceDetail = await this.getPriceDetailById(id, {
        relations: { priceList: true },
      });
    }
    if (code) {
      priceDetail = await this.getPriceDetailByCode(code, {
        relations: { priceList: true },
      });
    }
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    const priceList: PriceList = priceDetail.priceList;
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (priceList.endDate <= currentDate) {
      throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
    }
    priceDetail.updatedBy = adminExist.id;

    await this.priceDetailRepository.delete(priceDetail);
    return {
      id: priceDetail.id,
      code: priceDetail.code,
      message: 'Xoá thành công',
    };
  }

  async deleteMultiPriceDetailByIdsOrCodes(
    adminId: string,
    dto: DeletePriceDetailDto,
    type: DeleteDtoTypeEnum,
  ) {
    try {
      const { list } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: adminId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const newList = await Promise.all(
        list.map(async (data) => {
          if (!data) {
            return {
              id: type === 'id' ? data : undefined,
              code: type === 'code' ? data : undefined,
              message: `${type} không được để trống`,
            };
          }
          let priceDetail;
          if (type === DeleteDtoTypeEnum.ID) {
            priceDetail = await this.getPriceDetailById(data, {
              relations: { priceList: true },
            });
          } else {
            priceDetail = await this.getPriceDetailByCode(data, {
              relations: { priceList: true },
            });
          }
          if (!priceDetail) {
            return {
              id: type === 'id' ? data : undefined,
              code: type === 'code' ? data : undefined,
              message: 'Không tìm thấy chi tiết bảng giá',
            };
          }
          const priceList: PriceList = priceDetail.priceList;
          const currentDate = new Date(moment().format('YYYY-MM-DD'));
          if (priceList.endDate <= currentDate) {
            throw new BadRequestException('PRICE_LIST_IS_EXPIRED');
          }
          priceDetail.updatedBy = adminExist.id;

          await this.priceDetailRepository.delete(priceDetail);
          return {
            id: type === 'id' ? data : undefined,
            code: type === 'code' ? data : undefined,
            message: 'Xoá thành công',
          };
        }),
      );
      return newList;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
