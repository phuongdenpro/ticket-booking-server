import { OrderStatusEnum, TicketStatusEnum } from '../../enums';
import { Customer, Order, OrderDetail } from '../../database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  RevenueCustomerStatisticsDto,
  StatisticsDto,
  TicketStatisticsDto,
  TopCustomerStatisticsDto,
} from './dto';
import * as moment from 'moment';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  // tính tổng doanh thu
  async getTotalRevenueLastDays(dto: StatisticsDto): Promise<number> {
    // week, month
    const { type } = dto;
    let numOrDate = 1;
    if (type === 'week' || !type) {
      numOrDate = 7;
    } else if (type === 'month') {
      numOrDate = 30;
    }
    const { sum } = await this.orderRepository
      .createQueryBuilder('q')
      .select('SUM(q.finalTotal)', 'sum')
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('q.status = :status', { status: OrderStatusEnum.PAID })
      .andWhere('q.deletedAt IS NULL')
      .getRawOne();

    return Number(sum);
  }

  // tính tổng hoá đơn
  async getTotalOrdersLastDays(dto: StatisticsDto): Promise<number> {
    // week, month
    const { type } = dto;
    let numOrDate = 1;
    if (type === 'week' || !type) {
      numOrDate = 7;
    } else if (type === 'month') {
      numOrDate = 30;
    }

    const { count } = await this.orderRepository
      .createQueryBuilder('q')
      .select('COUNT(q.id)', 'count')
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('q.status = :status', { status: OrderStatusEnum.PAID })
      .andWhere('q.deletedAt IS NULL')
      .getRawOne();
    return Number(count);
  }

  // Tính tổng số vé bán ra
  async getTotalTicketsSoldLastDays(dto: StatisticsDto) {
    // week, month
    const { type } = dto;
    let numOrDate = 1;
    if (type === 'week' || !type) {
      numOrDate = 7;
    } else if (type === 'month') {
      numOrDate = 30;
    }

    const orderDetails = await this.orderDetailRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.ticketDetail', 'td')
      .leftJoinAndSelect('q.order', 'oo')
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('td.status = :soldStatus', {
        soldStatus: TicketStatusEnum.SOLD,
      })
      .getMany();

    return orderDetails.length;
  }

  // Tính tổng số khách hàng mua vé
  async getTotalCustomersLastDays(dto: StatisticsDto): Promise<number> {
    // week, month
    const { type } = dto;
    let numOrDate = 1;
    if (type === 'week' || !type) {
      numOrDate = 7;
    } else if (type === 'month') {
      numOrDate = 30;
    }

    const { count } = await this.orderRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.customer', 'c')
      .select('COUNT(DISTINCT c.id)', 'count')
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('q.status = :status', { status: OrderStatusEnum.PAID })
      .getRawOne();
    return Number(count);
  }

  //
  async getStatisticsLastDays(dto: StatisticsDto) {
    const [totalRevenue, totalOrders, totalTicketsSold, totalCustomers] =
      await Promise.all([
        this.getTotalRevenueLastDays(dto),
        this.getTotalOrdersLastDays(dto),
        this.getTotalTicketsSoldLastDays(dto),
        this.getTotalCustomersLastDays(dto),
      ]);
    return {
      totalRevenue,
      totalOrders,
      totalTicketsSold,
      totalCustomers,
    };
  }

  // tìm 5 khách hàng mua vé với số tiền nhiều nhất trong 7 or 30 ngày gần đây
  async getTopCustomersLastDays(dto: TopCustomerStatisticsDto) {
    // week, month
    const { type, limit } = dto;
    let startDate;
    const endDate = moment().endOf('day').toDate();
    if (type === 'week' || !type) {
      startDate = moment().subtract(7, 'days').startOf('day').toDate();
    } else if (type === 'month') {
      startDate = moment().subtract(30, 'days').startOf('day').toDate();
    }

    const topCustomersDto = new RevenueCustomerStatisticsDto();
    topCustomersDto.limit = limit;
    topCustomersDto.startDate = startDate;
    topCustomersDto.endDate = endDate;
    const topCustomers = await this.getRevenueCustomers(
      topCustomersDto,
    );
    return topCustomers;
  }

  // tính doanh thu theo từng ngày trong 7 ngày gần đây
  async getRevenueByDayLastDays(dto: StatisticsDto) {
    // week, month
    const { type } = dto;
    let numOrDate = 1;
    if (type === 'week' || !type) {
      numOrDate = 7;
    } else if (type === 'month') {
      numOrDate = 30;
    }

    const revenueByDay = await this.orderRepository
      .createQueryBuilder('q')
      .select(['DATE(q.createdAt) as day', 'SUM(q.finalTotal) as total'])
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('q.status = :status', { status: OrderStatusEnum.PAID })
      .groupBy('day')
      .getRawMany();

    return revenueByDay;
  }

  // tính tổng số vé bán được theo tuyến trong khoảng thời gian a -> b
  async getTicketsSoldByRoute(dto: TicketStatisticsDto) {
    const { startDate, endDate, limit } = dto;
    const newStartDate = startDate
      ? moment().subtract(7, 'days').startOf('day').toDate()
      : moment(startDate).startOf('day').toDate();
    const newEndDate = endDate
      ? moment().endOf('day').toDate()
      : moment(endDate).endOf('day').toDate();

    const queryBuilder = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderDetails', 'orderDetail')
      .innerJoin('orderDetail.ticketDetail', 'ticketDetail')
      .innerJoin('ticketDetail.ticket', 'ticket')
      .innerJoin('ticket.tripDetail', 'tripDetail')
      .innerJoin('tripDetail.trip', 'trip')
      .select('trip.code', 'tripCode')
      .addSelect('COUNT(ticket.id)', 'totalTickets')
      .where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: newStartDate,
        endDate: newEndDate,
      })
      .andWhere('order.deletedAt IS NULL')
      .andWhere('order.status = :status', { status: OrderStatusEnum.PAID })
      .andWhere('ticketDetail.deletedAt IS NULL')
      .andWhere('ticket.deletedAt IS NULL')
      .andWhere('tripDetail.deletedAt IS NULL')
      .groupBy('trip.id')
      .orderBy('totalTickets', 'DESC')
      .limit(limit || 10);

    const result = await queryBuilder.getRawMany();
    return result.map((item) => ({
      tripCode: item.tripCode,
      totalTickets: parseInt(item.totalTickets),
    }));
  }

  // tính doanh thu theo khách hàng
  async getRevenueCustomers(dto: RevenueCustomerStatisticsDto) {
    // week, month
    const { startDate, endDate, limit } = dto;
    const newStartDate = startDate
      ? moment().subtract(7, 'days').startOf('day').toDate()
      : moment(startDate).startOf('day').toDate();
    const newEndDate = endDate
      ? moment().endOf('day').toDate()
      : moment(endDate).endOf('day').toDate();

    const topCustomers = await this.customerRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.orders', 'o')
      .select([
        'q.id as customerId',
        'q.fullName as fullName',
        'SUM(o.finalTotal) as total',
        'COUNT(o.id) as numberOfOrders',
      ])
      .where(`o.createdAt BETWEEN :startDate AND :endDate`, {
        startDate: newStartDate,
        endDate: newEndDate,
      })
      .andWhere('o.status = :status', { status: OrderStatusEnum.PAID })
      .groupBy('q.id')
      .orderBy('total', 'DESC')
      .limit(limit || 5)
      .getRawMany();

    // Lấy số lượng hoá đơn cho mỗi khách hàng trong 7 ngày gần đây
    const numberOfOrdersByCustomers = await this.customerRepository
      .createQueryBuilder('q2')
      .leftJoin('q2.orders', 'o2')
      .select(['q2.id as customerId', 'COUNT(o2.id) as numberOfOrders'])
      .where(`o2.createdAt BETWEEN :startDate AND :endDate`, {
        startDate: newStartDate,
        endDate: newEndDate,
      })
      .groupBy('q2.id')
      .getRawMany();

    // Kết hợp kết quả của hai truy vấn và trả về kết quả cuối cùng
    const result = topCustomers.map((customer) => {
      const numberOfOrders = numberOfOrdersByCustomers.find(
        (item) => item.customerId === customer.customerId,
      )?.numberOfOrders;
      return {
        ...customer,
        numberOfOrders: Number(numberOfOrders),
      };
    });

    return result;
  }
}
