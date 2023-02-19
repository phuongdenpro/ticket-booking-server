import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TripDetailService } from './trip-detail.service';
import { TripDetailController } from './trip-detail.controller';
import { TripDetail } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TripDetail])],
  providers: [TripDetailService],
  controllers: [TripDetailController],
  exports: [TripDetailService],
})
export class TripDetailModule {}
