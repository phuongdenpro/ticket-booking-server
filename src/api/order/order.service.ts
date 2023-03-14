import { TripDetailService } from './../trip-detail/trip-detail.service';
import { Order, OrderDetail } from './../../database/entities';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  CreateOrderDto,
  CreateOrderDetailDto,
  UpdateOrderDto,
  UpdateOrderDetailDto,
} from './dto';
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
  SeatTypeEnum,
  TicketStatusEnum,
} from './../../enums';
import { generateOrderId } from './../../utils';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { UpdateTicketDetailDto } from '../ticket/dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
    private readonly tripDetailService: TripDetailService,
    private readonly priceListService: PriceListService,
  ) {}

  // order
  async findOrderById(id: string, options?: any) {
    return await this.orderRepository.findOne({
      where: { id, ...options?.where },
      relations: ['orderDetails'].concat(options?.relations || []),
      select: { deletedAt: false, ...options?.select },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOrderByCode(code: string, options?: any) {
    return await this.orderRepository.findOne({
      where: { code, ...options?.where },
      relations: ['orderDetails'].concat(options?.relations || []),
      select: { deletedAt: false, ...options?.select },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async createOrder(dto: CreateOrderDto, userId: string) {
    const { note, status, seatIds, seatCodes, tripDetailId } = dto;
    // check permission
    const customer = await this.customerService.findOneById(userId);
    const admin = await this.adminService.findOneBydId(userId);
    if (!customer && !admin) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    if (customer && customer.status === 0) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (admin && admin.isActive === false) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    // check trip detail
    const tripDetail = await this.tripDetailService.getTripDetailById(
      tripDetailId,
      {
        relations: ['trip'],
      },
    );
    const currentDate = new Date();
    if (currentDate > tripDetail.departureTime) {
      throw new BadRequestException('TRIP_DETAIL_HAS_PASSED');
    }
    if (!tripDetail.isActive) {
      throw new UnauthorizedException('TRIP_DETAIL_NOT_ACTIVE');
    }
    console.log(tripDetail.trip);

    // check trip
    const trip = tripDetail.trip;
    if (!trip.isActive || trip.startDate > currentDate) {
      throw new BadRequestException('TRIP_NOT_ACTIVE');
    }
    if (trip.endDate < currentDate) {
      throw new BadRequestException('TRIP_NOT_ACTIVE');
    }

    const order = new Order();
    order.note = note;
    if (customer) {
      order.customer = customer;
      order.createdBy = customer.id;
    } else if (admin) {
      order.staff = admin;
      order.createdBy = admin.id;
    }
    if (status) {
      switch (status) {
        case OrderStatusEnum.PAID:
          order.status = OrderStatusEnum.PAID;
          break;
        case OrderStatusEnum.CANCEL:
          order.status = OrderStatusEnum.CANCEL;
          break;
        default:
          order.status = OrderStatusEnum.UNPAID;
          break;
      }
    } else {
      order.status = OrderStatusEnum.UNPAID;
    }
    let code = generateOrderId();
    let flag = true;
    while (flag) {
      const orderExist = await this.findOrderByCode(code);
      if (!orderExist) {
        flag = false;
      } else {
        code = generateOrderId();
      }
    }
    order.code = code;
    order.total = 0;
    order.finalTotal = 0;

    if (!seatIds && !seatCodes) {
      throw new BadRequestException('SEAT_IDS_OR_SEAT_CODES_REQUIRED');
    }
    const createOrder = await this.orderRepository.save(order);
    if (seatIds && seatIds.length > 0) {
      const orderDetails = await seatIds.map(async (seatId) => {
        const dto = new CreateOrderDetailDto();
        dto.note = '';
        dto.orderId = createOrder.id;
        dto.seatId = seatId;
        dto.tripDetailId = tripDetailId;
        return await this.createOrderDetail(dto, userId);
      });
      createOrder.orderDetails = await Promise.all(orderDetails);
      createOrder.total = createOrder.orderDetails.reduce(
        (total, orderDetail) => total + orderDetail.total,
        0,
      );
      createOrder.finalTotal = createOrder.total;
    } else if (seatCodes && seatCodes.length > 0) {
      const orderDetails = await seatCodes.map(async (seatCode) => {
        const dto = new CreateOrderDetailDto();
        dto.note = '';
        dto.orderId = createOrder.id;
        dto.seatCode = seatCode;
        dto.tripDetailId = tripDetailId;
        return await this.createOrderDetail(dto, userId);
      });
      createOrder.orderDetails = await Promise.all(orderDetails);
      createOrder.total = createOrder.orderDetails.reduce(
        (total, orderDetail) => total + orderDetail.total,
        0,
      );
      createOrder.finalTotal = createOrder.total;
    }
    const saveOrder = await this.orderRepository.save(order);
    delete saveOrder.deletedAt;
    return saveOrder;
  }

  async getOrderById(id: string, options?: any) {
    const order = await this.findOrderById(id, options);
    if (!order) {
      throw new UnauthorizedException('ORDER_NOT_FOUND');
    }
    return order;
  }

  async getOrderByCode(code: string, options?: any) {
    const order = await this.findOrderByCode(code, options);
    if (!order) {
      throw new UnauthorizedException('ORDER_NOT_FOUND');
    }
    return order;
  }

  async updateOrderById(id: string, dto: UpdateOrderDto, userId: string) {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new NotFoundException('ORDER_NOT_FOUND');
    }
    const { note, status, seatCodes, seatIds } = dto;
    if (note) {
      order.note = note;
    }
    // update seat
    if (order.status === OrderStatusEnum.UNPAID) {
      // if old status = unpaid
      if (seatIds && seatIds.length > 0) {
        seatIds.forEach(async (seatId, index) => {
          const seat = await this.seatService.getSeatById(seatId);
          if (index + 1 <= order.orderDetails.length) {
          }
        });
      }
    }
    // update status
    if (status) {
      // if old status is unpaid => update status paid and cancel
      if (order.status === OrderStatusEnum.UNPAID) {
        switch (status) {
          case OrderStatusEnum.PAID:
            order.status = OrderStatusEnum.PAID;
            break;
          case OrderStatusEnum.CANCEL:
            order.status = OrderStatusEnum.CANCEL;
            break;
          default:
            order.status = OrderStatusEnum.UNPAID;
            break;
        }
      }
      // if old status is paid => update status cancel
      if (order.status === OrderStatusEnum.PAID) {
        if (status === OrderStatusEnum.CANCEL) {
          order.status = OrderStatusEnum.CANCEL;
        }
      }
    }
  }

  // async updateOrderByCode(id: string, dto: CreateOrderDto, userId: string) {}

  // order detail
  async findOrderDetailById(id: string, options?: any) {
    return await this.orderDetailRepository.findOne({
      where: { id, ...options?.where },
      relations: ['orderDetails'].concat(options?.relations),
      select: { deletedAt: false, ...options?.select },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOrderDetailByCode(code: string, options?: any) {
    return await this.orderDetailRepository.findOne({
      where: { code, ...options?.where },
      relations: options?.relations,
      select: { deletedAt: false, ...options?.select },
      orderBy: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async createOrderDetail(dto: CreateOrderDetailDto, userId: string) {
    // check permission
    const customer = await this.customerService.findOneById(userId);
    const staff = await this.adminService.findOneBydId(userId);
    if (!customer && !staff) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    const { note, orderId, seatId, seatCode, tripDetailId } = dto;
    const orderExist = await this.findOrderById(orderId);
    if (!orderExist) {
      throw new NotFoundException('ORDER_NOT_FOUND');
    }
    if (orderExist.status === OrderStatusEnum.CANCEL) {
      throw new BadRequestException('ORDER_IS_CANCELLED');
    }
    if (orderExist.status === OrderStatusEnum.PAID) {
      throw new BadRequestException('ORDER_IS_PAID');
    }

    const orderDetail = new OrderDetail();
    orderDetail.note = note;
    orderDetail.order = orderExist;
    if (customer) {
      orderDetail.createdBy = customer.id;
    } else if (staff) {
      orderDetail.createdBy = staff.id;
    }
    // get ticket detail
    if (!seatId && !seatCode) {
      throw new BadRequestException('SEAT_ID_OR_SEAT_CODE_REQUIRED');
    }
    let ticketDetail;
    if (seatId) {
      const seat = await this.seatService.getSeatById(seatId);
      if (seat.type === SeatTypeEnum.SOLD) {
        throw new BadRequestException('SEAT_IS_SOLD');
      } else if (seat.type === SeatTypeEnum.PENDING) {
        throw new BadRequestException('SEAT_IS_SOLD');
      }
      ticketDetail = await this.ticketService.findOneTicketDetailBy({
        where: {
          seat: {
            id: seat.id,
            vehicle: {
              tripDetails: {
                id: tripDetailId,
              },
            },
          },
        },
        relations: ['seat.vehicle.tripDetails'],
      });
      if (!ticketDetail) {
        throw new NotFoundException('TICKET_DETAIL_NOT_FOUND');
      }
      delete ticketDetail.seat;
      orderDetail.ticketDetail = ticketDetail;
    } else if (seatCode) {
      const seat = await this.seatService.getSeatByCode(seatCode);
      ticketDetail = await this.ticketService.findOneTicketDetailBy({
        where: {
          seat: {
            id: seat.id,
            vehicle: {
              tripDetails: {
                id: tripDetailId,
              },
            },
          },
        },
        relations: ['seat.vehicle.tripDetails'],
      });
      if (!ticketDetail) {
        throw new UnauthorizedException('TICKET_DETAIL_NOT_FOUND');
      }
      delete ticketDetail.seat;
      orderDetail.ticketDetail = ticketDetail;
    }
    // get price detail
    const ticketDetailId = ticketDetail.id;
    const currentDate = new Date(`${new Date().toDateString()}`);
    const priceDetail = await this.priceListService.findOnePriceDetailBy({
      where: {
        applicablePriceDetails: {
          trip: {
            tripDetails: {
              id: tripDetailId,
            },
          },
        },
        ticketGroup: {
          ticketGroupDetail: {
            ticket: {
              ticketDetails: {
                id: ticketDetailId,
              },
            },
          },
        },
        priceList: {
          startDate: LessThanOrEqual(currentDate),
          endDate: MoreThanOrEqual(currentDate),
          status: 1,
        },
      },
      relations: [
        'applicablePriceDetails.trip.tripDetails',
        'ticketGroup.ticketGroupDetail.ticket.ticketDetails',
        'priceList',
      ],
      orderBy: {
        createdAt: SortEnum.DESC,
      },
    });
    if (!priceDetail) {
      throw new NotFoundException('PRICE_DETAIL_NOT_FOUND');
    }
    console.log(priceDetail);
    orderDetail.priceDetail = priceDetail;
    orderDetail.total = priceDetail.price;
    console.log(priceDetail);

    // const createOrderDetail = await this.orderDetailRepository.save(
    //   orderDetail,
    // );
    // // update ticket detail status
    // const ticketDetailDto = new UpdateTicketDetailDto();
    // ticketDetailDto.status = TicketStatusEnum.PENDING;
    // await this.ticketService.updateTicketDetailById(
    //   ticketDetailId,
    //   ticketDetailDto,
    //   userId,
    // );

    // // update seat status
    // if (seatId) {
    //   await this.seatService.updateSeatById(
    //     seatId,
    //     {
    //       name: undefined,
    //       type: SeatTypeEnum.PENDING,
    //       floor: undefined,
    //       vehicleId: undefined,
    //     },
    //     userId,
    //   );
    // } else if (seatCode) {
    //   await this.seatService.updateSeatByCode(
    //     seatCode,
    //     {
    //       name: undefined,
    //       type: SeatTypeEnum.PENDING,
    //       floor: undefined,
    //       vehicleId: undefined,
    //     },
    //     userId,
    //   );
    // }
    // delete createOrderDetail.deletedAt;
    // return createOrderDetail;
    return new OrderDetail();
  }

  // async updateOrderDetailById(dto: UpdateOrderDetailDto, userId: string) {}

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
}
