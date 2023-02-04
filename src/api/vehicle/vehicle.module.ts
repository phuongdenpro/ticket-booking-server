import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { ImageResource, Vehicle } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ImageResource])],
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule {}
