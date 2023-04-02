import { Pagination } from './../../decorator';
import { TripDetailService } from './../trip-detail/trip-detail.service';
import {
  Order,
  OrderDetail,
  PromotionLine,
  Seat,
  Vehicle,
} from './../../database/entities';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderDetailDto } from './dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OrderStatusEnum,
  SortEnum,
  SeatStatusEnum,
  TicketStatusEnum,
  UserStatusEnum,
  ActiveStatusEnum,
} from './../../enums';
import { generateOrderCode } from './../../utils';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { UpdateTicketDetailDto } from '../ticket/dto';
import * as moment from 'moment';
import { PromotionLineService } from '../promotion-line/promotion-line.service';
import { UpdateSeatDto } from '../seat/dto';
moment.locale('vi');

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(PromotionLine)
    private readonly promotionLineRepository: Repository<PromotionLine>,
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
    private readonly tripDetailService: TripDetailService,
    private readonly priceListService: PriceListService,
    private readonly promotionLineService: PromotionLineService,
  ) {}

  private SEAT_TYPE_DTO_ID = 'id';
  private SEAT_TYPE_DTO_CODE = 'code';

  // order
  async findOneOrder(options: any) {
    return await this.orderRepository.findOne({
      where: { ...options?.where },
      select: { deletedAt: false, ...options?.select },
      relations: {
        orderDetails: true,
        staff: true,
        customer: true,
        promotionHistories: true,
        ...options?.relations,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOneOrderById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneOrder(options);
  }

  async findOneOrderByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneOrder(options);
  }

  async getOrderById(id: string, options?: any) {
    const order = await this.findOneOrderById(id, options);
    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }
    return order;
  }

  async getOrderByCode(code: string, options?: any) {
    const order = await this.findOneOrderByCode(code, options);
    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }
    return order;
  }

  async createOrder(dto: CreateOrderDto, creatorId: string) {
    const { note, seatIds, seatCodes, tripDetailCode, customerId } = dto;
    // check permission
    const customerCreator = await this.customerService.findOneById(creatorId);
    const admin = await this.adminService.findOneBydId(creatorId);
    if (!creatorId) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (
      (customerCreator &&
        customerCreator.status === UserStatusEnum.INACTIVATE) ||
      (admin && !admin.isActive)
    ) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customer = await this.customerService.findOneById(customerId);
    if (!customerId) {
      throw new UnauthorizedException('CUSTOMER_NOT_FOUND');
    }
    if (customer && customer.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    // check trip detail
    const tripDetail = await this.tripDetailService.getTripDetailByCode(
      tripDetailCode,
      {
        relations: { trip: true },
      },
    );
    const currentDate = new Date(moment().format('YYYY-MM-DD HH:mm'));
    const currentDatePlus15Minutes = new Date(
      moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm'),
    );
    if (currentDate >= tripDetail.departureTime) {
      throw new BadRequestException('TRIP_DETAIL_HAS_PASSED');
    } else if (
      customerCreator &&
      currentDatePlus15Minutes >= tripDetail.departureTime
    ) {
      throw new BadRequestException('TRIP_DETAIL_HAS_PASSED_15_MINUTES');
    }
    // check trip
    const trip = tripDetail.trip;
    if (trip.startDate > currentDate || trip.endDate < currentDate) {
      throw new BadRequestException('TRIP_NOT_ACTIVE');
    }

    const order = new Order();
    order.note = note;
    order.customer = customer;
    if (customerCreator) {
      order.createdBy = customerCreator.id;
    } else if (admin) {
      order.staff = admin;
      order.createdBy = admin.id;
    }
    order.status = OrderStatusEnum.UNPAID;
    // generate order code
    let code = generateOrderCode();
    let flag = true;
    while (flag) {
      const orderExist = await this.findOneOrderByCode(code);
      if (!orderExist) {
        flag = false;
      } else {
        code = generateOrderCode();
      }
    }
    order.code = code;
    order.total = 0;
    order.finalTotal = 0;

    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let createOrder: Order;
    try {
      createOrder = await queryRunner.manager.save(order);

      if (!seatIds && !seatCodes) {
        throw new BadRequestException('SEAT_IDS_OR_SEAT_CODES_REQUIRED');
      }
      let seatType;
      if (seatIds && seatIds.length > 0) {
        seatType = this.SEAT_TYPE_DTO_ID;
      } else if (seatCodes && seatCodes.length > 0) {
        seatType = this.SEAT_TYPE_DTO_CODE;
      }
      // create order detail
      let orderDetails;
      if (seatType === this.SEAT_TYPE_DTO_ID) {
        orderDetails = seatIds.map(async (seatId) => {
          const dto = new CreateOrderDetailDto();
          dto.note = '';
          dto.seatId = seatId;
          dto.orderId = createOrder.id;
          dto.tripDetailCode = tripDetail.code;
          return await this.createOrderDetail(dto, creatorId, createOrder);
        });
      } else if (seatType === this.SEAT_TYPE_DTO_CODE) {
        orderDetails = seatCodes.map(async (seatCode) => {
          const dto = new CreateOrderDetailDto();
          dto.note = '';
          dto.seatCode = seatCode;
          dto.orderId = createOrder.id;
          dto.tripDetailCode = tripDetail.code;
          return await this.createOrderDetail(dto, creatorId, createOrder);
        });
      }

      createOrder.orderDetails = await Promise.all(orderDetails);
      if (!createOrder.orderDetails || createOrder.orderDetails?.length === 0) {
        throw new BadRequestException('CREATE_ORDER_DETAIL_FAILED');
      }
      createOrder.total = createOrder.orderDetails.reduce(
        (total, orderDetail) => total + orderDetail.total,
        0,
      );
      createOrder.finalTotal = createOrder.total;

      const saveOrder = await queryRunner.manager.save(createOrder);
      delete saveOrder.deletedAt;
      delete saveOrder?.staff;
      delete saveOrder?.customer;
      await queryRunner.commitTransaction();
      return saveOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrder(dto, pagination?: Pagination) {
    const query = this.orderRepository.createQueryBuilder('q');
  }

  // order detail
  async findOrderDetail(options?: any) {
    return await this.orderDetailRepository.findOne({
      where: { ...options?.where },
      relations: ['orderDetails'].concat(options?.relations),
      select: { deletedAt: false, ...options?.select },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOrderDetailById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneOrder(options);
  }

  async findOrderDetailByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneOrder(options);
  }

  async getOrderDetailById(id: string, options?: any) {
    const order = await this.findOrderDetailById(id, options);
    if (!order) {
      throw new UnauthorizedException('ORDER_DETAIL_NOT_FOUND');
    }
    return order;
  }

  async getOrderDetailByCode(code: string, options?: any) {
    const order = await this.findOrderDetailByCode(code, options);
    if (!order) {
      throw new UnauthorizedException('ORDER_DETAIL_NOT_FOUND');
    }
    return order;
  }

  async createOrderDetail(
    dto: CreateOrderDetailDto,
    userId: string,
    order?: Order,
  ) {
    const queryRunnerOrderDetail =
      this.orderDetailRepository.manager.connection.createQueryRunner();
    await queryRunnerOrderDetail.connect();
    await queryRunnerOrderDetail.startTransaction();
    try {
      // check permission
      const customer = await this.customerService.findOneById(userId);
      const admin = await this.adminService.findOneBydId(userId);

      if (!customer && !admin) {
        throw new UnauthorizedException('USER_NOT_FOUND');
      }
      if (
        (customer && customer.status === UserStatusEnum.INACTIVATE) ||
        (admin && !admin.isActive)
      ) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const { note, orderId, seatId, seatCode, tripDetailCode } = dto;
      const orderExist = order || (await this.findOneOrderById(orderId));
      if (!orderExist) {
        throw new BadRequestException('ORDER_NOT_FOUND');
      }
      switch (orderExist.status) {
        case OrderStatusEnum.CANCEL:
          throw new BadRequestException('ORDER_IS_CANCELLED');
          break;
        case OrderStatusEnum.PAID:
          throw new BadRequestException('ORDER_IS_PAID');
          break;
        default:
          break;
      }

      const orderDetail = new OrderDetail();
      orderDetail.note = note;
      orderDetail.order = orderExist;
      if (customer) {
        orderDetail.createdBy = customer.id;
      } else if (admin) {
        orderDetail.createdBy = admin.id;
      }
      // get ticket detail
      if (!seatId && !seatCode) {
        throw new BadRequestException('SEAT_ID_OR_SEAT_CODE_REQUIRED');
      }

      let seat: Seat;
      if (seatId) {
        seat = await this.seatService.findOneSeatById(seatId);
      } else if (seatCode) {
        seat = await this.seatService.findOneSeatByCode(seatCode);
      }
      if (
        seat.status === SeatStatusEnum.SOLD ||
        seat.status === SeatStatusEnum.PENDING
      ) {
        throw new BadRequestException('SEAT_IS_SOLD');
      }

      const ticketDetail = await this.ticketService.findOneTicketDetail({
        where: {
          seat: { id: seat.id },
          ticket: {
            tripDetail: { code: tripDetailCode },
          },
        },
        relations: {
          seat: { vehicle: true },
          ticket: { tripDetail: { trip: true } },
        },
      });
      if (!ticketDetail) {
        throw new NotFoundException('TICKET_NOT_FOUND');
      }
      const vehicle: Vehicle = ticketDetail.seat.vehicle;
      const trip = ticketDetail.ticket.tripDetail.trip;
      delete ticketDetail.seat;
      delete ticketDetail.ticket;

      orderDetail.ticketDetail = ticketDetail;
      // get price detail
      const ticketDetailId = ticketDetail.id;
      const currentDate = new Date(moment().format('YYYY-MM-DD'));
      const priceDetail = await this.priceListService.findOnePriceDetail({
        where: {
          seatType: vehicle.type,
          trip: { id: trip.id },
          priceList: {
            startDate: LessThanOrEqual(currentDate),
            endDate: MoreThanOrEqual(currentDate),
            status: ActiveStatusEnum.ACTIVE,
          },
        },
        relations: { priceList: true, trip: true },
      });
      delete priceDetail.trip;
      delete priceDetail.priceList;
      if (!priceDetail) {
        throw new NotFoundException('PRICE_DETAIL_NOT_FOUND');
      }
      orderDetail.priceDetail = priceDetail;
      orderDetail.total = priceDetail.price;
      const createOrderDetail = await queryRunnerOrderDetail.manager.save(
        orderDetail,
      );
      if (!createOrderDetail) {
        throw new BadRequestException('CREATE_ORDER_DETAIL_FAILED');
      }

      // update ticket detail status
      const ticketDetailDto = new UpdateTicketDetailDto();
      ticketDetailDto.status = TicketStatusEnum.PENDING;
      const saveTicketDetail = await this.ticketService.updateTicketDetailById(
        ticketDetailId,
        ticketDetailDto,
        userId,
        queryRunnerOrderDetail.manager,
      );
      if (!saveTicketDetail) {
        throw new BadRequestException('UPDATE_TICKET_DETAIL_FAILED');
      }

      // // update seat status
      const seatDto = new UpdateSeatDto();
      seatDto.status = SeatStatusEnum.PENDING;
      let saveSeat: Seat;
      if (seatId) {
        saveSeat = await this.seatService.updateSeatByIdOrCode(
          seatDto,
          userId,
          seatId,
          undefined,
          queryRunnerOrderDetail.manager,
        );
      } else if (seatCode) {
        saveSeat = await this.seatService.updateSeatByIdOrCode(
          seatDto,
          userId,
          undefined,
          seatCode,
          queryRunnerOrderDetail.manager,
        );
      }
      if (!saveSeat) {
        throw new BadRequestException('UPDATE_SEAT_FAILED');
      }
      await queryRunnerOrderDetail.commitTransaction();

      delete createOrderDetail.deletedAt;
      delete createOrderDetail.order;
      delete createOrderDetail.priceDetail;
      delete createOrderDetail.ticketDetail;
      return createOrderDetail;
    } catch (error) {
      await queryRunnerOrderDetail.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunnerOrderDetail.release();
    }
  }
}
