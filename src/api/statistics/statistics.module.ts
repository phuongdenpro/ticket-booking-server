import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Customer,
  Order,
  OrderDetail,
  PromotionLine,
  Staff,
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
      Staff,
      Trip,
      TripDetail,
      TicketDetail,
      Ticket,
      PromotionLine,
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService],
})
export class StatisticsModule {}
