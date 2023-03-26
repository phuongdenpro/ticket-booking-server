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
  ],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
