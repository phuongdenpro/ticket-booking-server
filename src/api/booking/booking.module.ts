import { SeatService } from './../seat/seat.service';
import {
  Seat,
  Ticket,
  TicketDetail,
  Promotion,
  Order,
  OrderDetail,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Seat,
      TicketDetail,
      Promotion,
      Order,
      OrderDetail,
    ]),
  ],
  providers: [BookingService, SeatService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
