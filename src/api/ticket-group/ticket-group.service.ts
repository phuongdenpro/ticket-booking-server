import { DeleteMultiTicketGroupDto } from './dto/delete-multi-ticket-group.dto';
import { Pagination } from './../../decorator';
import { SortEnum } from './../../enums';
import { Staff, TicketGroup } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CreateTicketGroupDto,
  FilterTicketGroupDto,
  UpdateTicketGroupDto,
} from './dto';

@Injectable()
export class TicketGroupService {
  constructor(
    @InjectRepository(TicketGroup)
    private readonly tickerGroupRepository: Repository<TicketGroup>,
    private dataSource: DataSource,
  ) {}

  private selectFields = [
    'q.id',
    'q.name',
    'q.description',
    'q.note',
    'q.createdBy',
    'q.updatedBy',
    'q.createdAt',
    'q.updatedAt',
  ];

  async createTicketGroup(dto: CreateTicketGroupDto, adminId: string) {
    const { name, description, note } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const ticketGroup = new TicketGroup();
    ticketGroup.name = name;
    ticketGroup.description = description;
    ticketGroup.note = note;
    ticketGroup.createdBy = adminExist.id;

    const { deletedAt, ...saveTicketGroup } =
      await this.tickerGroupRepository.save(ticketGroup);
    return saveTicketGroup;
  }

  async findOneTicketGroupById(id: string) {
    const query = this.tickerGroupRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query.select(this.selectFields).getOne();

    return { dataResult };
  }

  async findAllTicketGroup(dto: FilterTicketGroupDto, pagination?: Pagination) {
    const { keywords, sort } = dto;
    const query = this.tickerGroupRepository.createQueryBuilder('q');

    if (keywords) {
      query
        .orWhere('q.name LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.description LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (sort) {
      query.orderBy('q.name', sort).orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.name', SortEnum.DESC).orderBy('q.createdAt', sort);
    }

    const dataResult = await query
      .select(this.selectFields)
      .skip(pagination.skip)
      .take(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    return { dataResult, pagination, total };
  }

  async updateTicketGroupById(
    id: string,
    dto: UpdateTicketGroupDto,
    adminId: string,
  ) {
    const { name, description, note } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const ticketGroup = await this.tickerGroupRepository.findOne({
      where: { id },
    });
    if (name) {
      ticketGroup.name = name;
    }
    if (description) {
      ticketGroup.description = description;
    }
    if (note) {
      ticketGroup.note = note;
    }
    ticketGroup.updatedBy = adminExist.id;

    const { deletedAt, ...saveTicketGroup } =
      await this.tickerGroupRepository.save(ticketGroup);
    return saveTicketGroup;
  }

  async deleteTicketGroupById(id: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const ticketGroup = await this.tickerGroupRepository.findOne({
      where: { id },
    });
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND', ticketGroup.id);
    }
    ticketGroup.updatedBy = adminExist.id;
    ticketGroup.deletedAt = new Date();

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    return { id: saveTicketGroup.id, message: 'Xoá thành công' };
  }

  async deleteMultipleTicketGroups(
    adminId: string,
    dto: DeleteMultiTicketGroupDto,
  ) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deleteTicketGroupById(id, adminId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
