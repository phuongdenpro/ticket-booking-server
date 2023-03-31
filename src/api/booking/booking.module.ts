import { SeatService } from './../seat/seat.service';
import {
  Seat,
  Ticket,
  TicketDetail,
  Promotion,
  Order,
  OrderDetail,
  Staff,
  Customer,
  TripDetail,
  PriceList,
  PriceDetail,
  PromotionLine,
  PromotionDetail,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { OrderService } from '../order/order.service';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { PromotionLineService } from '../promotion-line/promotion-line.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seat,
      Ticket,
      TicketDetail,
      Promotion,
      Order,
      OrderDetail,
      Staff,
      Customer,
      TripDetail,
      PriceList,
      PriceDetail,
      Promotion,
      PromotionLine,
      PromotionDetail,
    ]),
  ],
  providers: [
    BookingService,
    OrderService,
    CustomerService,
    AdminService,
    SeatService,
    TicketService,
    PriceListService,
    PromotionLineService,
  ],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
