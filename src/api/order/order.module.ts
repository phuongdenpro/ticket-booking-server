import { PromotionLineService } from './../promotion-line/promotion-line.service';
import { PriceListService } from './../price-list/price-list.service';
import { PriceList } from './../../database/entities/price-list.entities';
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
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TicketService } from '../ticket/ticket.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      OrderRefund,
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
  ],
  exports: [OrderService],
})
export class OrderModule {}
