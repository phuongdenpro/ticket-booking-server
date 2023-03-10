import {
  Seat,
  Ticket,
  TicketDetail,
  Promotion,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Seat, TicketDetail, Promotion])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
