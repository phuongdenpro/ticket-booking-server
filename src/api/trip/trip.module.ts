import { TripDetailService } from './../trip-detail/trip-detail.service';
import { Vehicle, TripDetail, Trip } from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDetail, Vehicle])],
  providers: [TripService, TripDetailService],
  controllers: [TripController],
  exports: [TripService],
})
export class TripModule {}
