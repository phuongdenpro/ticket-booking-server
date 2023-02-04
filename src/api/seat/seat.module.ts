import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';

@Module({
  providers: [SeatService]
})
export class SeatModule {}
