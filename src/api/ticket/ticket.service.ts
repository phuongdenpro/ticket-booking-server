import { Pagination } from './../../decorator';
import { SortEnum } from './../../enums';
import { CreateTicketDto, FilterTicketDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, Ticket, TicketDetail } from './../../database/entities';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TripDetailService } from '../trip-detail/trip-detail.service';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketDetail)
    private readonly ticketGroupRepository: Repository<TicketDetail>,
    private tripDetailService: TripDetailService,
    private seatService: SeatService,
    private dataSource: DataSource,
  ) {}

  private selectFieldsWithQ = [
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

  // ticket service
  async findOneTicketByCode(code: string, options?: any) {
    return await this.ticketRepository.findOne({
      where: { code, ...options?.where },
      relations: ['ticketDetails'].concat(options?.relations || []),
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
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
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
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

    const currentDate: Date = new Date(`${new Date().toDateString()}`);
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
    const tripDetail = await this.tripDetailService.findTripDetailById(
      tripDetailId,
      {
        relations: ['vehicle.seats'],
      },
    );
    if (!tripDetail) {
      throw new NotFoundException('TRIP_DETAIL_NOT_FOUND');
    }
    const seats = tripDetail.vehicle.seats;
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
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate && startDate >= currentDate) {
      startDate = new Date(startDate);
      query.andWhere('q.startDate >= :startDate', { startDate });
    }
    if (endDate && endDate >= currentDate && endDate >= startDate) {
      endDate = new Date(endDate);
      query.andWhere('q.endDate >= :endDate', { endDate });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    const total = await query.getCount();
    const dataResult = await query
      .leftJoinAndSelect('q.ticketDetails', 't')
      .select(this.selectFieldsWithQ)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    return { dataResult, pagination, total };
  }

  // ticket detail service
  async createTicketDetail(ticketId: string, seatId: string, adminId: string) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    const ticketExist = await this.getTicketById(ticketId);
    const seatExist = await this.seatService.getSeatById(seatId);

    const ticketDetail = new TicketDetail();
    ticketDetail.ticket = ticketExist;
    ticketDetail.seat = seatExist;
    ticketDetail.code = `${ticketExist.code}-${seatExist.name}`;
    const saveTicketDetail = await this.ticketGroupRepository.save(
      ticketDetail,
    );
    delete saveTicketDetail.deletedAt;
    return saveTicketDetail;
  }
}
