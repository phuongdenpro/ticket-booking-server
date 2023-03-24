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

  private selectFieldsWithQ = [
    'q.id',
    'q.code',
    'q.name',
    'q.description',
    'q.note',
    'q.createdBy',
    'q.updatedBy',
    'q.createdAt',
    'q.updatedAt',
  ];

  async findOneTicketGroup(options: any) {
    return await this.tickerGroupRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.ASC,
        ...options?.order,
      },
      ...options.other,
    });
  }

  async findOneTicketGroupById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneTicketGroup(options);
  }

  async findOneTicketGroupByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneTicketGroup(options);
  }

  async getTicketGroupById(id: string, adminId: string, options?: any) {
    const admin = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const ticketGroup = await this.findOneTicketGroupById(id, options);
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
    }
    return ticketGroup;
  }

  async getTicketGroupByCode(code: string, adminId: string, options?: any) {
    const admin = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const ticketGroup = await this.findOneTicketGroupByCode(code, options);
    if (!ticketGroup) {
      throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
    }
    return ticketGroup;
  }

  async createTicketGroup(dto: CreateTicketGroupDto, adminId: string) {
    const { name, description, note, code } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const ticketGroupExist = await this.findOneTicketGroupByCode(code, {
      other: { withDeleted: true },
    });
    if (ticketGroupExist) {
      throw new BadRequestException('TICKET_GROUP_CODE_ALREADY_EXIST');
    }

    const ticketGroup = new TicketGroup();
    ticketGroup.code = code;
    ticketGroup.name = name;
    ticketGroup.description = description;
    ticketGroup.note = note;
    ticketGroup.createdBy = adminExist.id;

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    delete saveTicketGroup.deletedAt;
    return saveTicketGroup;
  }

  async findAllTicketGroup(dto: FilterTicketGroupDto, pagination?: Pagination) {
    const { keywords, sort } = dto;
    const query = this.tickerGroupRepository.createQueryBuilder('q');

    if (keywords) {
      query
        .orWhere('q.code LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.name LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.description LIKE :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (sort) {
      query.orderBy('q.name', sort);
    } else {
      query.orderBy('q.name', SortEnum.DESC);
    }

    const dataResult = await query
      .addOrderBy('q.createdAt', SortEnum.ASC)
      .select(this.selectFieldsWithQ)
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
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const ticketGroup = await this.getTicketGroupById(id, adminId);
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

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    delete saveTicketGroup.deletedAt;
    return saveTicketGroup;
  }

  async updateTicketGroupByCode(
    code: string,
    dto: UpdateTicketGroupDto,
    adminId: string,
  ) {
    const { name, description, note } = dto;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const ticketGroup = await this.getTicketGroupByCode(code, adminId);
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

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    delete saveTicketGroup.deletedAt;
    return saveTicketGroup;
  }

  async deleteTicketGroupById(id: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const ticketGroup = await this.getTicketGroupById(id, adminId);
    ticketGroup.updatedBy = adminExist.id;
    ticketGroup.deletedAt = new Date();

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    return { id: saveTicketGroup.id, message: 'Xoá thành công' };
  }

  async deleteTicketGroupByCode(code: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const ticketGroup = await this.getTicketGroupByCode(code, adminId);
    ticketGroup.updatedBy = adminExist.id;
    ticketGroup.deletedAt = new Date();

    const saveTicketGroup = await this.tickerGroupRepository.save(ticketGroup);
    return { id: saveTicketGroup.id, message: 'Xoá thành công' };
  }

  async deleteMultipleTicketGroupsByIds(
    adminId: string,
    dto: DeleteMultiTicketGroupDto,
  ) {
    try {
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: adminId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }
      const { data: ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => {
          const ticketGroup = await this.findOneTicketGroupById(id);
          if (!ticketGroup) {
            return { id: ticketGroup.id, message: 'không tìm thấy nhóm vé' };
          }
          ticketGroup.updatedBy = adminExist.id;
          ticketGroup.deletedAt = new Date();

          const saveTicketGroup = await this.tickerGroupRepository.save(
            ticketGroup,
          );
          return { id: saveTicketGroup.id, message: 'Xoá thành công' };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleTicketGroupsByCodes(
    adminId: string,
    dto: DeleteMultiTicketGroupDto,
  ) {
    try {
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: adminId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }
      const { data: codes } = dto;

      const list = await Promise.all(
        codes.map(async (code) => {
          const ticketGroup = await this.findOneTicketGroupByCode(code);
          if (!ticketGroup) {
            return { id: ticketGroup.id, message: 'không tìm thấy nhóm vé' };
          }
          ticketGroup.updatedBy = adminExist.id;
          ticketGroup.deletedAt = new Date();

          const saveTicketGroup = await this.tickerGroupRepository.save(
            ticketGroup,
          );
          return { id: saveTicketGroup.id, message: 'Xoá thành công' };
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
