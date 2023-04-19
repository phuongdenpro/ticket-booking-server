import { OrderStatusEnum, TicketStatusEnum } from '../../enums';
import { Customer, Order, OrderDetail } from '../../database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StatisticsDto, TopCustomerStatisticsDto } from './dto';

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
      .leftJoinAndSelect('order.customer', 'c')
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
}
