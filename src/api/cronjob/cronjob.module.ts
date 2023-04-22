import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { CronjobController } from './cronjob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  Staff,
  Customer,
  Seat,
  Ticket,
  TicketDetail,
  TripDetail,
  PriceDetail,
  PromotionDetail,
  PromotionLine,
  Promotion,
  Trip,
  PromotionHistory,
  OrderRefund,
  OrderRefundDetail,
  PriceList,
} from './../../database/entities';
import { PromotionLineService } from './../promotion-line/promotion-line.service';
import { PriceListService } from './../price-list/price-list.service';
import { SeatService } from './../seat/seat.service';
import { AdminService } from './../admin/admin.service';
import { CustomerService } from './../customer/customer.service';
import { OrderService } from './../order/order.service';
import { TicketService } from './../ticket/ticket.service';
import { PromotionHistoryService } from './../promotion-history/promotion-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      OrderRefund,
      OrderRefundDetail,
      Staff,
      Customer,
      Seat,
      Ticket,
      Trip,
      TicketDetail,
      TripDetail,
      PriceList,
      PriceDetail,
      Promotion,
      PromotionLine,
      PromotionDetail,
      PromotionHistory,
    ]),
  ],
  providers: [
    CronjobService,
    OrderService,
    AdminService,
    CustomerService,
    SeatService,
    TicketService,
    PriceListService,
    PromotionLineService,
    PromotionHistoryService,
  ],
  controllers: [CronjobController],
  exports: [CronjobService],
})
export class CronjobModule {}
