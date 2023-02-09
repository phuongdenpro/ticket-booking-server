import { Vehicle } from './../../database/entities/vehicle.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { Seat } from 'src/database/entities';
import { SeatController } from './seat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, Vehicle])],
  providers: [SeatService],
  exports: [SeatService],
  controllers: [SeatController],
})
export class SeatModule {}
