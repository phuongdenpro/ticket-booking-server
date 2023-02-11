import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { ImageResource, Vehicle, Staff } from 'src/database/entities';
import { ImageResourceService } from '../image-resource/image-resource.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ImageResource, Staff])],
  controllers: [VehicleController],
  providers: [VehicleService, ImageResourceService],
  exports: [VehicleService],
})
export class VehicleModule {}
