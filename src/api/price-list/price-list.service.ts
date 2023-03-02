import { ActiveStatusEnum, SortEnum } from './../../enums';
import {
  CreatePriceListDto,
  FilterPriceListDto,
  UpdatePriceListDto,
  DeletePriceListDto,
  CreatePriceDetailDto,
  FilterPriceDetailDto,
  UpdatePriceDetailDto,
} from './dto';
import { PriceDetail, PriceList, Staff } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from './../../decorator';
import { DataSource, Repository } from 'typeorm';
import { TicketGroupService } from '../ticket-group/ticket-group.service';

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

  private selectFieldsPriceDetail = [
    'q.id',
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
  ];

  async createPriceList(dto: CreatePriceListDto, adminId: string) {
    const { name, note, startDate, endDate, status } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const priceList = new PriceList();
    if (!name) {
      throw new UnauthorizedException('NAME_IS_REQUIRED');
    }
    priceList.name = name;
    priceList.note = note;
    priceList.status = ActiveStatusEnum.ACTIVE === status ? true : false;
    priceList.createdBy = adminExist.id;

    if (!startDate) {
      throw new UnauthorizedException('START_DATE_IS_REQUIRED');
    }
    if (startDate > endDate) {
      throw new UnauthorizedException('START_DATE_MUST_BE_LESS_THAN_END_DATE');
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate < currentDate) {
      throw new UnauthorizedException('START_DATE_GREATER_THAN_NOW');
    }
    priceList.startDate = startDate;

    if (!endDate) {
      throw new UnauthorizedException('END_DATE_IS_REQUIRED');
    }
    if (startDate > endDate) {
      throw new UnauthorizedException('END_DATE_GREATER_THAN_START_DATE');
    }
    priceList.endDate = endDate;

    const { deletedAt, ...savePriceList } = await this.priceListRepository.save(
      priceList,
    );
    return savePriceList;
  }

  async getPriceListById(id: string) {
    const priceList = await this.priceListRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'note',
        'startDate',
        'endDate',
        'status',
        'createdAt',
        'updatedAt',
        'createdBy',
        'updatedBy',
      ],
    });
    return priceList;
  }

  async findAllPriceList(dto: FilterPriceListDto, pagination?: Pagination) {
    const { keywords, startDate, endDate, status, sort } = dto;

    const query = this.priceListRepository.createQueryBuilder('q');

    if (keywords) {
      query
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
      const newEndDate = new Date(
        new Date().setDate(new Date(endDate).getDate() + 1),
      );
      query.andWhere('q.endDate <= :endDate', { endDate: newEndDate });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const dataResult = await query
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
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const priceList = await this.priceListRepository.findOne({
      where: { id },
    });
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    if (name) {
      priceList.name = name;
    }
    if (note) {
      priceList.note = note;
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
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
    if (status) {
      priceList.status = status === ActiveStatusEnum.ACTIVE ? true : false;
    }

    priceList.updatedBy = adminExist.id;
    const updateTrip = await this.priceListRepository.save(priceList);
    return updateTrip;
  }

  async deletePriceListById(id: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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

  async deleteMultiPriceListByIds(adminId: string, dto: DeletePriceListDto) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deletePriceListById(id, adminId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createPriceDetail(dto: CreatePriceDetailDto, adminId: string) {
    const { price, note, priceListId, ticketGroupId } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const priceList = await this.getPriceListById(priceListId);
    if (!priceList) {
      throw new BadRequestException('PRICE_LIST_NOT_FOUND');
    }

    const ticketGroup = await this.ticketGroupService.findOneTicketGroupById(
      ticketGroupId,
    );
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
    }
    const priceDetail = new PriceDetail();

    if (price < 0) {
      throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
    }
    priceDetail.price = price;
    priceDetail.note = note;
    priceDetail.priceList = priceList;
    priceDetail.ticketGroup = ticketGroup;
    priceDetail.createdBy = adminExist.id;

    delete priceDetail.ticketGroup.createdAt;
    delete priceDetail.ticketGroup.updatedAt;
    delete priceDetail.ticketGroup.createdBy;
    delete priceDetail.ticketGroup.updatedBy;
    delete priceDetail.priceList.createdAt;
    delete priceDetail.priceList.updatedAt;
    delete priceDetail.priceList.createdBy;
    delete priceDetail.priceList.updatedBy;

    const savePriceDetail = await this.priceDetailRepository.save(priceDetail);
    delete savePriceDetail.deletedAt;
    return savePriceDetail;
  }

  async getPriceDetailById(id: string) {
    const query = this.priceDetailRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const priceDetail = await query
      .leftJoinAndSelect('q.ticketGroup', 't')
      .select(this.selectFieldsPriceDetail)
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
      .select(this.selectFieldsPriceDetail)
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
    const { price, note, priceListId, ticketGroupId } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const priceDetail = await this.getPriceDetailById(id);
    if (!priceDetail) {
      throw new BadRequestException('PRICE_DETAIL_NOT_FOUND');
    }

    if (price) {
      if (price < 0) {
        throw new BadRequestException('PRICE_MUST_GREATER_THAN_ZERO');
      }
      priceDetail.price = price;
    }
    if (note) {
      priceDetail.note = note;
    }
    if (priceListId) {
    }
    if (ticketGroupId) {
    }
  }
}
