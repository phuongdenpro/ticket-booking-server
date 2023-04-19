import { OrderStatusEnum } from '../../enums';
import { Order, Ticket } from '../../database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StatisticsDto } from './dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private dataSource: DataSource,
  ) {}

  // tính tổng doanh thu
  async getTotalRevenueLastDays(dto: StatisticsDto) {
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

    return sum;
  }

  // tính tổng hoá đơn
  async getTotalOrdersLastDays(dto: StatisticsDto) {
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

    const { sum } = await this.ticketRepository
      .createQueryBuilder('q')
      .select('SUM(q.quantitySold)', 'sum')
      .where(`q.createdAt >= DATE_SUB(NOW(), INTERVAL ${numOrDate} DAY)`)
      .andWhere('q.deletedAt IS NULL')
      .getRawOne();
    return sum;
  }

  //
  async getStatisticsLastDays(dto: StatisticsDto) {
    const [
      totalRevenue,
      totalOrders,
      // totalTicketsSold, totalCustomers
    ] = await Promise.all([
      this.getTotalRevenueLastDays(dto),
      this.getTotalOrdersLastDays(dto),
      // this.getTotalTicketsSoldLast7Days(dto),
      // this.getTotalCustomersLast7Days(dto),
    ]);
    return {
      totalRevenue,
      totalOrders,
      // totalTicketsSold,
      // totalCustomers,
    };
  }
}
