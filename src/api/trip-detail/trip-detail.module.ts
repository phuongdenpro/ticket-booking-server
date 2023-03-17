import { SeatService } from './../seat/seat.service';
import { TicketService } from './../ticket/ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { TripDetailService } from './trip-detail.service';
import { TripDetailController } from './trip-detail.controller';
import {
  TicketDetail,
  TripDetail,
  Ticket,
  Seat,
} from './../../database/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TripDetail, Ticket, TicketDetail, Seat])],
  providers: [TripDetailService, TicketService, SeatService],
  controllers: [TripDetailController],
  exports: [TripDetailService],
})
export class TripDetailModule {}
