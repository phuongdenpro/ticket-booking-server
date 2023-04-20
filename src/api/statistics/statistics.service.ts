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
import { Pagination } from './../../decorator';

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
    topCustomersDto.startDate = startDate;
    topCustomersDto.endDate = endDate;
    const topCustomers = await this.getRevenueCustomers(topCustomersDto, {
      take: limit || 5,
      skip: 0,
    });
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
  async getTicketsSoldByRoute(
    dto: TicketStatisticsDto,
    pagination?: Pagination,
  ) {
    const { keyword, startDate, endDate } = dto;
    const newStartDate = startDate
      ? moment().subtract(7, 'days').startOf('day').toDate()
      : moment(startDate).startOf('day').toDate();
    const newEndDate = endDate
      ? moment().endOf('day').toDate()
      : moment(endDate).endOf('day').toDate();

    let newKeywords;
    let subQuery;
    if (keyword) {
      newKeywords = keyword.trim();
      subQuery = this.orderRepository
        .createQueryBuilder('q2')
        .innerJoin('q2.orderDetails', 'od2')
        .innerJoin('od2.ticketDetail', 'td2')
        .innerJoin('td2.ticket', 't2')
        .innerJoin('t2.tripDetail', 'trd2')
        .innerJoin('trd2.trip', 'tr2')
        .where('tr2.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('tr2.name LIKE :name', { name: `%${newKeywords}%` })
        .orWhere('tr2.note LIKE :note', { note: `%${newKeywords}%` })
        .select('tr2.id')
        .getQuery();
    }

    const queryBuilder = await this.orderRepository
      .createQueryBuilder('q')
      .innerJoin('q.orderDetails', 'od')
      .innerJoin('od.ticketDetail', 'td')
      .innerJoin('td.ticket', 't')
      .innerJoin('t.tripDetail', 'trd')
      .innerJoin('trd.trip', 'tr')
      .select([
        'tr.id as id',
        'tr.code as code',
        'tr.name as name',
        'tr.startDate as startDate',
        'tr.endDate as endDate',
        'tr.status as status',
        'COUNT(t.id) as totalTickets',
      ])
      .where('q.createdAt BETWEEN :startDate AND :endDate', {
        startDate: newStartDate,
        endDate: newEndDate,
      });
    if (keyword) {
      queryBuilder.andWhere('tr.id IN (' + subQuery + ')', {
        code: `%${newKeywords}%`,
        name: `%${newKeywords}%`,
        note: `%${newKeywords}%`,
      });
    }
    queryBuilder
      .andWhere('q.status = :status', { status: OrderStatusEnum.PAID })
      .andWhere('q.deletedAt IS NULL')
      .andWhere('td.deletedAt IS NULL')
      .andWhere('t.deletedAt IS NULL')
      .andWhere('trd.deletedAt IS NULL')
      .groupBy('tr.id')
      .orderBy('totalTickets', 'DESC')
      .offset(pagination.skip || 0)
      .limit(pagination.take || 10);

    const result = await queryBuilder.getRawMany();
    return result.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
      totalTickets: parseInt(item.totalTickets),
    }));
  }

  // tính doanh thu theo khách hàng trong khoảng thời gian a -> b
  async getRevenueCustomers(
    dto: RevenueCustomerStatisticsDto,
    pagination?: Pagination,
  ) {
    // week, month
    const { keyword, startDate, endDate } = dto;
    const newStartDate = startDate
      ? moment().subtract(7, 'days').startOf('day').toDate()
      : moment(startDate).startOf('day').toDate();
    const newEndDate = endDate
      ? moment().endOf('day').toDate()
      : moment(endDate).endOf('day').toDate();

    let subQuery;
    let newKeywords;
    if (keyword) {
      newKeywords = keyword.trim();
      subQuery = this.customerRepository
        .createQueryBuilder('q2')
        .where('q2.fullName LIKE :fullName', { fullName: `%${newKeywords}%` })
        .orWhere('q2.email LIKE :email', { email: `%${newKeywords}%` })
        .orWhere('q2.phone LIKE :phone', { phone: `%${newKeywords}%` })
        .orWhere('q2.address LIKE :address', { address: `%${newKeywords}%` })
        .orWhere('q2.fullAddress LIKE :fullAddress', {
          fullAddress: `%${newKeywords}%`,
        })
        .select('q2.id')
        .getQuery();
    }

    const query = this.customerRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.orders', 'o')
      .leftJoinAndSelect('q.ward', 'w')
      .leftJoinAndSelect('q.customerGroup', 'cg')
      .select([
        'q.id as customerId',
        'q.fullName as fullName',
        'q.phone as phone',
        'q.email as email',
        'q.gender as gender',
        'q.status as status',
        'w.code as wardCode',
        'cg.code as customerGroupCode',
        'cg.name as customerGroupName',
        'SUM(o.total) as total',
        'SUM(o.finalTotal) as finalTotal',
        'COUNT(o.id) as numberOfOrders',
      ])
      .where(`o.createdAt BETWEEN :startDate AND :endDate`, {
        startDate: newStartDate,
        endDate: newEndDate,
      });
    if (keyword) {
      query.andWhere(`q.id in (${subQuery})`, {
        fullName: `%${newKeywords}%`,
        email: `%${newKeywords}%`,
        phone: `%${newKeywords}%`,
        address: `%${newKeywords}%`,
        fullAddress: `%${newKeywords}%`,
      });
    }
    query
      .andWhere('o.status = :status', { status: OrderStatusEnum.PAID })
      .andWhere('o.deletedAt IS NULL')
      .groupBy('q.id')
      .orderBy('total', 'DESC')
      .offset(pagination.skip || 0)
      .limit(pagination.take || 10);

    const dataResult = await query.getRawMany();

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
    const result = dataResult.map((customer) => {
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
