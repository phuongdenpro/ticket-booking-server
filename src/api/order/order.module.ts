import { PromotionLineService } from './../promotion-line/promotion-line.service';
import { PriceListService } from './../price-list/price-list.service';
import { SeatService } from './../seat/seat.service';
import { AdminService } from './../admin/admin.service';
import { CustomerService } from './../customer/customer.service';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TicketService } from '../ticket/ticket.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';
import { PaymentService } from '../payment/payment.service';

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
  controllers: [OrderController],
  providers: [
    OrderService,
    AdminService,
    CustomerService,
    SeatService,
    TicketService,
    PriceListService,
    PromotionLineService,
    PromotionHistoryService,
    PaymentService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
