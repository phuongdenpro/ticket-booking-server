import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Customer,
  Order,
  OrderDetail,
  Ticket,
  TicketDetail,
  Trip,
  TripDetail,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      TicketDetail,
      OrderDetail,
      Customer,
      Trip,
      TripDetail,
      TicketDetail,
      Ticket,
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService],
})
export class StatisticsModule {}
