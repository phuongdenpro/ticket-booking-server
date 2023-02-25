import { SeatService } from './../seat/seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { ImageResource, Vehicle, Staff, Seat } from './../../database/entities';
import { ImageResourceService } from './../image-resource/image-resource.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ImageResource, Staff, Seat])],
  controllers: [VehicleController],
  providers: [VehicleService, ImageResourceService, SeatService],
  exports: [VehicleService],
})
export class VehicleModule {}
