import { SeatService } from './../seat/seat.service';
import { SeatModule } from './../seat/seat.module';
import { TripDetailService } from './../trip-detail/trip-detail.service';
import {
  Seat,
  Ticket,
  TicketDetail,
  TripDetail,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TripDetailModule } from '../trip-detail/trip-detail.module';
import { TicketController } from './ticket.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketDetail, TripDetail, Seat]),
    TripDetailModule,
    SeatModule,
  ],
  providers: [TicketService, TripDetailService, SeatService],
  exports: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
