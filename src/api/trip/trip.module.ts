import { Ticket } from './../../database/entities/ticket.entities';
import { Vehicle } from './../../database/entities/vehicle.entities';
import { TripDetail } from './../../database/entities/trip-detail.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { ImageResource, Trip } from 'src/database/entities';
import { ImageResourceService } from '../image-resource/image-resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      TripDetail,
      Vehicle,
      Ticket,
      ImageResource,
    ]),
  ],
  providers: [TripService, ImageResourceService],
  controllers: [TripController],
  exports: [TripService],
})
export class TripModule {}
