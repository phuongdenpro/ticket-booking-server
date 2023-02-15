import { Ticket } from './../../database/entities/ticket.entities';
import { Vehicle } from './../../database/entities/vehicle.entities';
import { TripDetail } from './../../database/entities/trip-detail.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDetail, Vehicle, Ticket])],
  providers: [TripService],
  controllers: [TripController],
  exports: [TripService],
})
export class TripModule {}
