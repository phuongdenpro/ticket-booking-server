import { Pagination } from './../../decorator';
import {
  ActiveStatusEnum,
  SortEnum,
  TicketStatusEnum,
  UserStatusEnum,
} from './../../enums';
import {
  CreateTicketDto,
  FilterTicketDto,
  UpdateTicketDto,
  FilterTicketDetailDto,
  UpdateTicketDetailDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Customer,
  Staff,
  Ticket,
  TicketDetail,
  TripDetail,
} from './../../database/entities';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SeatService } from '../seat/seat.service';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketDetail)
    private readonly ticketDetailRepository: Repository<TicketDetail>,
    private readonly seatService: SeatService,
    private dataSource: DataSource,
  ) {}

  private selectTicketFieldsWithQ = [
    'q.id',
    'q.code',
    'q.note',
    'q.startDate',
    'q.endDate',
    'q.createdBy',
    'q.updatedBy',
    'q.createdAt',
    'q.updatedAt',
    't',
  ];

  private selectTicketDetailFieldsJson = {
    ticket: {
      id: true,
      code: true,
      status: true,
      note: true,
      startDate: true,
      endDate: true,
    },
    seat: {
      id: true,
      name: true,
      type: true,
      floor: true,
    },
  };

  private selectTicketDetailFieldsWithQ = [
    'q.id',
    'q.code',
    'q.status',
    'q.note',
    'q.createdAt',
    'q.updatedAt',
    't.id',
    't.code',
  ];

  // other
  private async getTripDetailById(id: string) {
    return await this.dataSource.getRepository(TripDetail).findOne({
      where: { id },
      relations: ['vehicle', 'vehicle.seats'],
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
      },
    });
  }

  // ticket service
  async findOneTicketByCode(code: string, options?: any) {
    return await this.ticketRepository.findOne({
      where: { code, ...options?.where },
      relations: ['ticketDetails'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async findOneTicketById(id: string, options?: any) {
    return await this.ticketRepository.findOne({
      where: { id, ...options?.where },
      relations: ['ticketDetails'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async createTicket(dto: CreateTicketDto, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    const { code, note, startDate, endDate, tripDetailId } = dto;

    const ticketExist = await this.findOneTicketByCode(code);
    if (ticketExist) {
      throw new BadRequestException('TICKET_CODE_EXISTED');
    }

    const ticket = new Ticket();
    ticket.code = code;
    ticket.note = note;

    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (!startDate) {
      throw new BadRequestException('TICKET_START_DATE_IS_REQUIRED');
    }
    if (startDate <= currentDate) {
      throw new BadRequestException(
        'TICKET_START_DATE_GREATER_THAN_CURRENT_DATE',
      );
    }
    ticket.startDate = startDate;
    if (!endDate) {
      throw new BadRequestException('TICKET_END_DATE_IS_REQUIRED');
    }
    if (endDate <= startDate) {
      throw new BadRequestException(
        'TICKET_END_DATE_GREATER_THAN_TICKET_START_DATE',
      );
    }
    ticket.endDate = endDate;
    const tripDetail = await this.getTripDetailById(tripDetailId);
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    const seats = tripDetail?.vehicle?.seats;
    ticket.tripDetail = tripDetail;
    ticket.createdBy = adminExist.id;
    const saveTicket = await this.ticketRepository.save(ticket);
    delete saveTicket.deletedAt;
    delete saveTicket.tripDetail;

    if (seats && seats.length > 0) {
      for (const seat of seats) {
        await this.createTicketDetail(saveTicket.id, seat.id, adminId);
      }
    }

    return saveTicket;
  }

  async getTicketById(id: string) {
    const ticket = await this.findOneTicketById(id);
    if (!ticket) {
      throw new BadRequestException('TICKET_NOT_FOUND');
    }
    return ticket;
  }

  async getTicketByCode(code: string) {
    const ticket = await this.findOneTicketByCode(code);
    if (!ticket) {
      throw new BadRequestException('TICKET_NOT_FOUND');
    }
    return ticket;
  }

  async findAllTicket(dto: FilterTicketDto, pagination?: Pagination) {
    const { keywords, sort } = dto;
    let { startDate, endDate } = dto;

    const query = this.ticketRepository.createQueryBuilder('q');
    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note like :keywords', { keywords: `%${keywords}%` });
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (startDate && startDate >= currentDate) {
      startDate = new Date(startDate);
      query.andWhere('q.startDate >= :startDate', { startDate });
    }
    if (endDate && endDate >= currentDate && endDate >= startDate) {
      endDate = new Date(endDate);
      query.andWhere('q.endDate <= :endDate', { endDate });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const total = await query.getCount();
    const dataResult = await query
      .leftJoinAndSelect('q.ticketDetails', 't')
      .select(this.selectTicketFieldsWithQ)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  async updateTicketById(dto: UpdateTicketDto, id: string, adminId: string) {
    const ticket = await this.getTicketById(id);
    const { note, status, startDate, endDate, tripDetailId } = dto;
    if (note) {
      ticket.note = note;
    }
    if (status) {
      ticket.status = status === ActiveStatusEnum.ACTIVE ? true : false;
    }
    if (tripDetailId) {
      const tripDetail = await this.getTripDetailById(tripDetailId);
      if (!tripDetail) {
        throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
      }
      ticket.tripDetail = tripDetail;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (startDate) {
      if (startDate <= currentDate) {
        throw new BadRequestException(
          'TICKET_START_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
      ticket.startDate = startDate;
    }
    if (endDate) {
      if (endDate <= startDate) {
        throw new BadRequestException(
          'TICKET_END_DATE_GREATER_THAN_TICKET_START_DATE',
        );
      }
      ticket.endDate = endDate;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    ticket.updatedBy = adminExist.id;
    const saveTicket = await this.ticketRepository.save(ticket);
    delete saveTicket.deletedAt;
    return saveTicket;
  }

  async updateTicketByCode(
    dto: UpdateTicketDto,
    code: string,
    adminId: string,
  ) {
    const ticket = await this.getTicketByCode(code);
    const { note, status, startDate, endDate, tripDetailId } = dto;
    if (note) {
      ticket.note = note;
    }
    if (status) {
      ticket.status = status === ActiveStatusEnum.ACTIVE ? true : false;
    }
    if (tripDetailId) {
      const tripDetail = await this.getTripDetailById(tripDetailId);
      if (!tripDetail) {
        throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
      }
      ticket.tripDetail = tripDetail;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (startDate) {
      if (startDate <= currentDate) {
        throw new BadRequestException(
          'TICKET_START_DATE_GREATER_THAN_CURRENT_DATE',
        );
      }
      ticket.startDate = startDate;
    }
    if (endDate) {
      if (endDate <= startDate) {
        throw new BadRequestException(
          'TICKET_END_DATE_GREATER_THAN_TICKET_START_DATE',
        );
      }
      ticket.endDate = endDate;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    ticket.updatedBy = adminExist.id;
    const saveTicket = await this.ticketRepository.save(ticket);
    delete saveTicket.deletedAt;
    return saveTicket;
  }

  // ticket detail service
  async findOneTicketDetailByCode(code: string, options?: any) {
    return await this.ticketDetailRepository.findOne({
      where: { code, ...options?.where },
      relations: ['ticket', 'seat'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async findOneTicketDetailById(id: string, options?: any) {
    return await this.ticketDetailRepository.findOne({
      where: { id, ...options?.where },
      relations: ['ticket', 'seat'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async findOneTicketDetailBy(options: any) {
    // options = {
    //   where: {
    //     seat: {
    //       id: '7b1e022a-96da-47c5-85b6-81858fd0f601',
    //       vehicle: {
    //         tripDetails: {
    //           id: 'b87985ac-3b08-46bf-8e6f-02902dcaedaf',
    //         },
    //       },
    //     },
    //   },
    //   relations: ['seat.vehicle.tripDetails'],
    // };
    return await this.ticketDetailRepository.findOne({
      where: options?.where,
      relations: ['ticket', 'seat'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options,
    });
  }

  async createTicketDetail(ticketId: string, seatId: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    const ticketExist = await this.getTicketById(ticketId);
    const seatExist = await this.seatService.getSeatById(seatId);

    const ticketDetail = new TicketDetail();
    ticketDetail.ticket = ticketExist;
    ticketDetail.seat = seatExist;
    ticketDetail.note = '';
    ticketDetail.status = TicketStatusEnum.NON_SOLD;
    ticketDetail.code = `${ticketExist.code}-${seatExist.name}`;
    const saveTicketDetail = await this.ticketDetailRepository.save(
      ticketDetail,
    );
    delete saveTicketDetail.deletedAt;
    return saveTicketDetail;
  }

  async updateTicketDetailById(
    id: string,
    dto: UpdateTicketDetailDto,
    userId: string,
  ) {
    const { note, status } = dto;
    const ticketDetail = await this.getTicketDetailById(id);

    if (note) {
      ticketDetail.note = note;
    }
    if (status) {
      switch (status) {
        case TicketStatusEnum.SOLD:
          ticketDetail.status = TicketStatusEnum.SOLD;
          break;
        case TicketStatusEnum.PENDING:
          ticketDetail.status = TicketStatusEnum.PENDING;
          break;
        default:
          ticketDetail.status = TicketStatusEnum.NON_SOLD;
          break;
      }
    }

    const admin = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    const customer = await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { id: userId } });
    if (!admin && !customer) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (!admin.isActive || customer.status === UserStatusEnum.INACTIVATE) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }

    const saveTicketDetail = await this.ticketDetailRepository.save(
      ticketDetail,
    );
    return saveTicketDetail;
  }

  async getTicketDetailById(id: string) {
    const ticketDetail = await this.findOneTicketDetailById(id, {
      select: this.selectTicketDetailFieldsJson,
    });
    if (!ticketDetail) {
      throw new BadRequestException('TICKET_DETAIL_NOT_FOUND');
    }
    return ticketDetail;
  }

  async getTicketDetailByCode(code: string) {
    const ticketDetail = await this.findOneTicketDetailByCode(code, {
      select: this.selectTicketDetailFieldsJson,
    });
    if (!ticketDetail) {
      throw new BadRequestException('TICKET_DETAIL_NOT_FOUND');
    }
    return ticketDetail;
  }

  async findAllTicketDetail(
    dto: FilterTicketDetailDto,
    pagination?: Pagination,
  ) {
    const { keywords, status, sort, ticketCode, ticketId } = dto;

    const query = this.ticketDetailRepository.createQueryBuilder('q');
    if (keywords) {
      query
        .orWhere('q.code like :keywords', { keywords: `%${keywords}%` })
        .orWhere('q.note like :keywords', { keywords: `%${keywords}%` });
    }
    if (status) {
      query.andWhere('q.status = :status', {
        status: status === TicketStatusEnum.NON_SOLD ? 0 : 1,
      });
    }
    query.leftJoinAndSelect('q.ticket', 't');
    if (ticketCode) {
      query.andWhere('id.code = :ticketCode', { ticketCode });
    }
    if (ticketId) {
      query.andWhere('t.id = :ticketId', { ticketId });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const dataResult = await query
      .select(this.selectTicketDetailFieldsWithQ)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.getCount();

    return { dataResult, pagination, total };
  }
}
