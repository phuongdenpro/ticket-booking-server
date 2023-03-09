import { Ticket } from './../../database/entities/ticket.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { TripDetailService } from './trip-detail.service';
import { TripDetailController } from './trip-detail.controller';
import { TripDetail } from './../../database/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TripDetail, Ticket])],
  providers: [TripDetailService],
  controllers: [TripDetailController],
  exports: [TripDetailService],
})
export class TripDetailModule {}
