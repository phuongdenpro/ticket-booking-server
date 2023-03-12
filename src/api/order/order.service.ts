import { Order, OrderDetail } from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderDetailDto } from './dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusEnum, SortEnum } from './../../enums';
import { generateOrderId } from './../../utils';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';

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
    private readonly priceListService: PriceListService,
    private dataSource: DataSource,
  ) {}

  // order
  async findOrderById(id: string, options?: any) {
    return await this.orderRepository.findOne({
      where: { id, ...options?.where },
      relations: ['orderDetails'].concat(options?.relations),
      select: { deletedAt: false, ...options?.select },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }

  async findOrderByCode(code: string, options?: any) {
    return await this.orderRepository.findOne({
      where: { code, ...options?.where },
      relations: options?.relations,
      select: { deletedAt: false, ...options?.select },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }

  async createOrder(dto: CreateOrderDto, userId: string) {
    const { note, status, seatIds, seatCodes, tripDetailId } = dto;
    const order = new Order();
    order.note = note;

    const customer = await this.customerService.findOneById(userId);
    const staff = await this.adminService.findOneBydId(userId);
    if (!customer && !staff) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (customer) {
      order.customer = customer;
      order.createdBy = customer.id;
    } else if (staff) {
      order.staff = staff;
      order.createdBy = staff.id;
    }
    if (status) {
      switch (status) {
        case OrderStatusEnum.UNPAID:
          order.status = OrderStatusEnum.UNPAID;
          break;
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

    const saveOrder = await this.orderRepository.save(order);
    delete saveOrder.deletedAt;
    if (seatIds && seatIds.length > 0) {
      const orderDetails = await seatIds.map(async (seatId) => {
        const dto = new CreateOrderDetailDto();
        dto.note = '';
        dto.orderId = saveOrder.id;
        dto.seatId = seatId;
        dto.tripDetailId = tripDetailId;
        return await this.createOrderDetail(dto, userId);
      });
      saveOrder.orderDetails = await Promise.all(orderDetails);
    } else if (seatCodes && seatCodes.length > 0) {
      const orderDetails = await seatCodes.map(async (seatCode) => {
        const dto = new CreateOrderDetailDto();
        dto.note = '';
        dto.orderId = saveOrder.id;
        dto.seatCode = seatCode;
        dto.tripDetailId = tripDetailId;
        return await this.createOrderDetail(dto, userId);
      });
      saveOrder.orderDetails = await Promise.all(orderDetails);
    }
    return saveOrder;
  }

  async getOrderById(id: string) {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new UnauthorizedException('ORDER_NOT_FOUND');
    }
    return order;
  }

  async getOrderByCode(code: string) {
    const order = await this.findOrderByCode(code);
    if (!order) {
      throw new UnauthorizedException('ORDER_NOT_FOUND');
    }
    return order;
  }

  // order detail
  async findOrderDetailById(id: string, options?: any) {
    return await this.orderDetailRepository.findOne({
      where: { id, ...options?.where },
      relations: ['orderDetails'].concat(options?.relations),
      select: { deletedAt: false, ...options?.select },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }

  async findOrderDetailByCode(code: string, options?: any) {
    return await this.orderDetailRepository.findOne({
      where: { code, ...options?.where },
      relations: options?.relations,
      select: { deletedAt: false, ...options?.select },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options,
    });
  }

  async createOrderDetail(dto: CreateOrderDetailDto, userId: string) {
    const customer = await this.customerService.findOneById(userId);
    const staff = await this.adminService.findOneBydId(userId);
    if (!customer && !staff) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    const { note, orderId, seatId, seatCode, tripDetailId } = dto;
    const orderExist = await this.findOrderById(orderId);
    if (!orderExist) {
      throw new UnauthorizedException('ORDER_NOT_FOUND');
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
    if (seatId) {
      const seat = await this.seatService.getSeatById(seatId);
      const ticketDetail = await this.ticketService.findOneTicketDetailBy({
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
    } else if (seatCode) {
      const seat = await this.seatService.getSeatByCode(seatCode);
      const ticketDetail = await this.ticketService.findOneTicketDetailBy({
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
    // get price list
    const ticketDetailId = orderDetail.ticketDetail.id;
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
      },
      relations: [
        'applicablePriceDetails.trip.tripDetails',
        'ticketGroup.ticketGroupDetail.ticket.ticketDetails',
      ],
      select: {
        applicablePriceDetails: false,
        ticketGroup: false,
      },
    });
    orderDetail.priceDetail = priceDetail;

    const saveOrderDetail = await this.orderDetailRepository.save(orderDetail);
    delete saveOrderDetail.deletedAt;
    return saveOrderDetail;
  }

  async getOrderDetailById(id: string) {
    const order = await this.findOrderDetailById(id);
    if (!order) {
      throw new UnauthorizedException('ORDER_DETAIL_NOT_FOUND');
    }
    return order;
  }

  async getOrderDetailByCode(code: string) {
    const order = await this.findOrderDetailByCode(code);
    if (!order) {
      throw new UnauthorizedException('ORDER_DETAIL_NOT_FOUND');
    }
    return order;
  }
}
