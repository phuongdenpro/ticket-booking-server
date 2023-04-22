import { TripDetailService } from './../trip-detail/trip-detail.service';
import {
  Order,
  OrderDetail,
  OrderRefund,
  OrderRefundDetail,
  PromotionHistory,
  TicketDetail,
} from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { PromotionLineService } from '../promotion-line/promotion-line.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../order/order.service';
import { CronjobOrderPaymentDto } from './dto';
moment.locale('vi');

@Injectable()
export class CronjobService {
  constructor(
    private orderService: OrderService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async cronjobOrderPayment(dto: CronjobOrderPaymentDto) {
    const { secretKey } = dto;
    const secret = this.configService.get('SECRET_KET_CRONJOB');
    if (secretKey !== secret) {
      throw new BadRequestException('SECRET_KEY_IS_NOT_VALID');
    }
  }
}
