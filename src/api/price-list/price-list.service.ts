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
import { PriceDetail, PriceList, Staff } from './../../database/entities';
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
      const subQuery = this.priceListRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${keywords}%` })
        .orWhere('q2.name LIKE :name', { name: `%${keywords}%` })
        .orWhere('q2.note LIKE :note', { note: `%${keywords}%` })
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
    if (priceList.status === ActiveStatusEnum.ACTIVE) {
      throw new BadRequestException('PRICE_LIST_IS_ACTIVE');
    }
    if (name) {
      priceList.name = name;
    }
    if (note) {
      priceList.note = note;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate) {
      if (startDate <= currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      if (!endDate && startDate >= priceList.endDate) {
        throw new BadRequestException(
          'END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE',
        );
      }
      priceList.startDate = startDate;
    }
    if (endDate) {
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      if (!startDate && priceList.startDate > endDate) {
        throw new BadRequestException(
          'END_DATE_MUST_BE_GREATER_THAN_START_DATE',
        );
      }
      if (startDate && startDate > endDate) {
        throw new BadRequestException(
          'END_DATE_MUST_BE_GREATER_THAN_START_DATE',
        );
      }
      priceList.endDate = endDate;
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
    priceList.deletedAt = new Date();
    priceList.updatedBy = adminExist.id;

    const deletedPriceList = await this.priceListRepository.save(priceList);
    return {
      id: deletedPriceList.id,
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
          priceList.deletedAt = new Date();
          priceList.updatedBy = adminExist.id;

          const deletedPriceList = await this.priceListRepository.save(
            priceList,
          );
          return {
            id: deletedPriceList.id,
            code: deletedPriceList.code,
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
    const { code, price, note, priceListId, priceListCode } = dto;

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
    let priceList;
    if (priceListId) {
      priceList = await this.findOnePriceListById(priceListId);
    } else {
      priceList = await this.findOnePriceListByCode(priceListCode);
    }
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    const priceDetailExist = await this.findOnePriceDetail({
      where: {
        priceList: {
          startDate: LessThanOrEqual(currentDate),
          endDate: MoreThanOrEqual(currentDate),
          // status: ActiveStatusEnum.ACTIVE,
        },
        // ticketGroup: {
        //   id: ticketGroup.id,
        // },
      },
      relations: {
        priceList: true,
        ticketGroup: true,
      },
    });
    console.log(priceDetailExist);
    if (priceDetailExist) {
      // throw new BadRequestException('TICKET_GROUP_EXISTED_IN_PRICE_LIST', {
      //   description: `Nhóm vé ${ticketGroup?.name} đã tồn tại trong bảng giá có mã ${priceList?.code}`,
      // });
    }
    throw new BadRequestException('TEST');
    const priceDetail = new PriceDetail();
    if (price < 0) {
      throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
    }
    priceDetail.price = price;
    priceDetail.code = code;
    priceDetail.note = note;
    priceDetail.priceList = priceList;
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
    const { price, keywords, priceListId, sort } = dto;
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
    if (priceListId) {
      query
        .leftJoinAndSelect('q.priceList', 'p')
        .andWhere('p.id = :priceListId', { priceListId });
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
    const { price, note } = dto;
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
      priceDetail = await this.getPriceDetailById(id);
    } else if (code) {
      priceDetail = await this.getPriceDetailByCode(code);
    }
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
