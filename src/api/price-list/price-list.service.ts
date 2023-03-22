import { ActiveStatusEnum, SortEnum } from './../../enums';
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
import { DataSource, Repository } from 'typeorm';
import { TicketGroupService } from '../ticket-group/ticket-group.service';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepository: Repository<PriceList>,
    @InjectRepository(PriceDetail)
    private readonly priceDetailRepository: Repository<PriceDetail>,
    private ticketGroupService: TicketGroupService,
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

    const priceListExist = await this.findOnePriceListByCode(code, {
      other: {
        withDeleted: true,
      },
    });
    if (priceListExist) {
      throw new BadRequestException('PRICE_LIST_CODE_IS_EXIST');
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
    if (startDate > endDate) {
      throw new BadRequestException('START_DATE_MUST_BE_LESS_THAN_END_DATE');
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    priceList.startDate = startDate;
    if (!endDate) {
      throw new BadRequestException('END_DATE_IS_REQUIRED');
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
      query
        .orWhere('q.code LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (status) {
      let statusBool = true;
      if (status === ActiveStatusEnum.INACTIVE) statusBool = false;
      query.andWhere('q.status = :status', { status: statusBool });
    }
    if (startDate) {
      const newStartDate = new Date(startDate);
      query.andWhere('q.startDate >= :startDate', { startDate: newStartDate });
    }
    if (endDate) {
      const newEndDate = new Date(endDate);
      query.andWhere('q.endDate <= :endDate', { endDate: newEndDate });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const dataResult = await query
      .select(this.selectFieldsPriceListWithQ)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    return { dataResult, total, pagination };
  }

  async updatePriceListById(
    adminId: string,
    id: string,
    dto: UpdatePriceListDto,
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

    const priceList = await this.findOnePriceListById(id);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    if (name) {
      priceList.name = name;
    }
    if (note) {
      priceList.note = note;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate !== undefined || startDate !== null) {
      if (startDate < currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      const newStartDate = new Date(startDate);
      priceList.startDate = newStartDate;
    }
    if (endDate) {
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      if (startDate > endDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_START_DATE');
      }
      const newEndDate = new Date(endDate);
      priceList.endDate = newEndDate;
    }
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
        priceList.status = ActiveStatusEnum.ACTIVE;
        break;
      default:
        priceList.status = ActiveStatusEnum.INACTIVE;
        break;
    }

    priceList.updatedBy = adminExist.id;
    const updateTrip = await this.priceListRepository.save(priceList);
    return updateTrip;
  }

  async updatePriceListByCode(
    adminId: string,
    code: string,
    dto: UpdatePriceListDto,
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
    const priceList = await this.findOnePriceListByCode(code);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    if (name) {
      priceList.name = name;
    }
    if (note) {
      priceList.note = note;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate) {
      if (startDate < currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      if (startDate > endDate) {
        throw new BadRequestException('NEW_END_DATE_GREATER_THAN_START_DATE');
      }
      if (startDate > priceList.endDate) {
        throw new BadRequestException('OLD_END_DATE_GREATER_THAN_START_DATE');
      }
      const newStartDate = new Date(startDate);
      priceList.startDate = newStartDate;
    }
    if (endDate) {
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      if (startDate > endDate) {
        throw new BadRequestException('NEW_END_DATE_GREATER_THAN_START_DATE');
      }
      if (startDate > priceList.endDate) {
        throw new BadRequestException('OLD_END_DATE_GREATER_THAN_START_DATE');
      }
      const newEndDate = new Date(endDate);
      priceList.endDate = newEndDate;
    }
    switch (status) {
      case ActiveStatusEnum.ACTIVE:
        priceList.status = ActiveStatusEnum.ACTIVE;
        break;
      default:
        priceList.status = ActiveStatusEnum.INACTIVE;
        break;
    }

    priceList.updatedBy = adminExist.id;
    const updateTrip = await this.priceListRepository.save(priceList);
    return updateTrip;
  }

  async deletePriceListById(id: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const priceList = await this.priceListRepository.findOne({
      where: { id: id },
    });
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    priceList.deletedAt = new Date();
    priceList.updatedBy = adminExist.id;

    const deletedPriceList = await this.priceListRepository.save(priceList);
    return {
      id: deletedPriceList.id,
      message: 'Xoá thành công',
    };
  }

  async deletePriceListByCode(code: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceList = await this.findOnePriceListByCode(code);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }
    priceList.deletedAt = new Date();
    priceList.updatedBy = adminExist.id;

    const deletedPriceList = await this.priceListRepository.save(priceList);
    return {
      id: deletedPriceList.id,
      message: 'Xoá thành công',
    };
  }

  async deleteMultiPriceListByIds(adminId: string, dto: DeletePriceListDto) {
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
        ids.map(async (id) => {
          const priceList = await this.getPriceDetailById(id);
          if (!priceList) {
            return {
              id: priceList.id,
              message: 'Không tìm thấy bảng giá',
            };
          }
          priceList.deletedAt = new Date();
          priceList.updatedBy = adminExist.id;

          const deletedPriceList = await this.priceListRepository.save(
            priceList,
          );
          return {
            id: deletedPriceList.id,
            message: 'Xoá thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultiPriceListByCodes(adminId: string, dto: DeletePriceListDto) {
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
        ids.map(async (code) => {
          const priceList = await this.findOnePriceListByCode(code);
          if (!priceList) {
            return {
              id: priceList.id,
              message: 'Không tìm thấy bảng giá',
            };
          }
          priceList.deletedAt = new Date();
          priceList.updatedBy = adminExist.id;

          const deletedPriceList = await this.priceListRepository.save(
            priceList,
          );
          return {
            id: deletedPriceList.id,
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
      relations: [].concat(options?.relations || []),
      select: { ...options?.select },
      order: { createdAt: SortEnum.DESC, ...options?.order },
      ...options?.other,
    });
  }

  async createPriceDetail(dto: CreatePriceDetailDto, adminId: string) {
    const {
      code,
      price,
      note,
      priceListId,
      priceListCode,
      ticketGroupId,
      ticketGroupCode,
      tripId,
      tripCode,
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
    const priceDetailExist = await this.priceDetailRepository.findOne({
      where: { code: code },
    });
    if (priceDetailExist) {
      throw new BadRequestException('PRICE_DETAIL_CODE_EXISTED');
    }

    if (!priceListId && !priceListCode) {
      throw new BadRequestException('PRICE_LIST_ID_OR_CODE_REQUIRED');
    }
    let priceList;
    if (priceListId) {
      priceList = await this.findOnePriceListById(priceListId);
    } else {
      priceList = await this.findOnePriceListByCode(priceListCode);
    }
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    if (!ticketGroupId && !ticketGroupCode) {
      throw new BadRequestException('TICKET_GROUP_ID_OR_CODE_REQUIRED');
    }
    let ticketGroup;
    if (ticketGroupId) {
      ticketGroup = await this.ticketGroupService.findOneTicketGroupById(
        ticketGroupId,
      );
    } else {
      ticketGroup = await this.ticketGroupService.findOneTicketGroupByCode(
        ticketGroupCode,
      );
    }
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
    }

    if (!tripCode && !tripId) {
      throw new BadRequestException('TRIP_ID_OR_CODE_REQUIRED');
    }
    let trip;
    if (tripCode) {
      trip = await this.dataSource.getRepository(Trip).findOne({
        where: {
          code: tripCode,
        },
      });
    } else {
      trip = await this.dataSource.getRepository(Trip).findOne({
        where: {
          id: tripId,
        },
      });
    }
    if (!trip) {
      throw new BadRequestException('TRIP_NOT_FOUND');
    }
    const priceDetail = new PriceDetail();
    if (price < 0) {
      throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
    }
    priceDetail.price = price;
    priceDetail.code = code;
    priceDetail.note = note;
    priceDetail.priceList = priceList;
    priceDetail.ticketGroup = ticketGroup;
    priceDetail.trip = trip;
    priceDetail.createdBy = adminExist.id;

    const savePriceDetail = await this.priceDetailRepository.save(priceDetail);
    delete savePriceDetail.deletedAt;
    return savePriceDetail;
  }

  async getPriceDetailById(id: string) {
    const query = this.priceDetailRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const priceDetail = await query
      .leftJoinAndSelect('q.ticketGroup', 't')
      .select(this.selectFieldsPriceDetailWithQ)
      .getOne();

    return priceDetail;
  }

  async getPriceDetailByCode(code: string) {
    const query = this.priceDetailRepository.createQueryBuilder('q');
    query.where('q.code = :code', { code });

    const priceDetail = await query
      .leftJoinAndSelect('q.ticketGroup', 't')
      .select(this.selectFieldsPriceDetailWithQ)
      .getOne();

    return priceDetail;
  }

  async findAllPriceDetail(dto: FilterPriceDetailDto, pagination?: Pagination) {
    const { price, keywords, priceListId, sort } = dto;
    const query = this.priceDetailRepository.createQueryBuilder('q');

    if (price) {
      query.andWhere('q.price <= :price', { price });
    }
    if (keywords) {
      query.andWhere('q.note like :note', { note: `%${keywords}%` });
    }
    if (priceListId) {
      query
        .leftJoinAndSelect('q.priceList', 'p')
        .andWhere('p.id = :priceListId', { priceListId });
    }
    if (sort) {
      query.orderBy('q.price', sort);
    } else {
      query.orderBy('q.price', SortEnum.ASC);
    }

    const dataResult = await query
      .addOrderBy('q.note', SortEnum.ASC)
      .leftJoinAndSelect('q.ticketGroup', 't')
      .select(this.selectFieldsPriceDetailWithQ)
      .skip(pagination.skip)
      .take(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    return { dataResult, pagination, total };
  }

  async updatePriceDetailById(
    adminId: string,
    id: string,
    dto: UpdatePriceDetailDto,
  ) {
    const { price, note, ticketGroupId, ticketGroupCode } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceDetail = await this.getPriceDetailById(id);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }

    if (price) {
      if (price < 0) {
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
    if (ticketGroupId) {
      const ticketGroup = await this.ticketGroupService.findOneTicketGroupById(
        ticketGroupId,
      );
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      priceDetail.ticketGroup = ticketGroup;
    } else if (ticketGroupCode) {
      const ticketGroup =
        await this.ticketGroupService.findOneTicketGroupByCode(ticketGroupCode);
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      priceDetail.ticketGroup = ticketGroup;
    }
    priceDetail.updatedBy = adminExist.id;

    const updatePriceDetail = await this.priceDetailRepository.save(
      priceDetail,
    );
    delete updatePriceDetail.deletedAt;
    return updatePriceDetail;
  }

  async updatePriceDetailByCode(
    adminId: string,
    code: string,
    dto: UpdatePriceDetailDto,
  ) {
    const { price, note, ticketGroupId, ticketGroupCode } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceDetail = await this.getPriceDetailByCode(code);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }

    if (price) {
      if (price < 0) {
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
    if (ticketGroupId) {
      const ticketGroup = await this.ticketGroupService.findOneTicketGroupById(
        ticketGroupId,
      );
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      priceDetail.ticketGroup = ticketGroup;
    } else if (ticketGroupCode) {
      const ticketGroup =
        await this.ticketGroupService.findOneTicketGroupByCode(ticketGroupCode);
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }
      priceDetail.ticketGroup = ticketGroup;
    }
    priceDetail.updatedBy = adminExist.id;

    const updatePriceDetail = await this.priceDetailRepository.save(
      priceDetail,
    );
    delete updatePriceDetail.deletedAt;
    return updatePriceDetail;
  }

  async deletePriceDetailById(adminId: string, id: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceDetail = await this.getPriceDetailById(id);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    priceDetail.updatedBy = adminExist.id;
    priceDetail.deletedAt = new Date();

    return await this.priceDetailRepository.save(priceDetail);
  }

  async deletePriceDetailByCode(adminId: string, code: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const priceDetail = await this.getPriceDetailByCode(code);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }
    priceDetail.updatedBy = adminExist.id;
    priceDetail.deletedAt = new Date();

    return await this.priceDetailRepository.save(priceDetail);
  }

  async deleteMultiPriceDetailByIds(
    adminId: string,
    dto: DeletePriceDetailDto,
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
        ids.map(async (id) => {
          const priceDetail = await this.priceDetailRepository.findOne({
            where: { id: id },
          });
          if (!priceDetail) {
            return {
              id: priceDetail.id,
              message: 'Không tìm thấy chi tiết bảng giá',
            };
          }
          priceDetail.deletedAt = new Date();
          priceDetail.updatedBy = adminExist.id;

          const deletedPriceList = await this.priceDetailRepository.save(
            priceDetail,
          );
          return {
            id: deletedPriceList.id,
            message: 'Xoá thành công',
          };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultiPriceDetailByCodes(
    adminId: string,
    dto: DeletePriceDetailDto,
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
        ids.map(async (code) => {
          const priceDetail = await this.priceDetailRepository.findOne({
            where: { code },
          });
          if (!priceDetail) {
            return {
              id: priceDetail.id,
              message: 'Không tìm thấy chi tiết bảng giá',
            };
          }
          priceDetail.deletedAt = new Date();
          priceDetail.updatedBy = adminExist.id;

          const deletedPriceList = await this.priceDetailRepository.save(
            priceDetail,
          );
          return {
            id: deletedPriceList.id,
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
