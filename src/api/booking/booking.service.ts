import { TripDetailService } from './../trip-detail/trip-detail.service';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBookingDto } from './dto';
import { SeatService } from './../seat/seat.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly tripDetailService: TripDetailService,
    private readonly seatService: SeatService,
    private dataSource: DataSource,
  ) {}

  async booking(dto: CreateBookingDto, userId: string) {
    const { seatIds, tripDetailId } = dto;
    const tripDetailExists = await this.tripDetailService.getTripDetailById(
      tripDetailId,
    );
    const seats = await seatIds.map(async (seatId) => {
      const seat = await this.seatService.getSeatById(seatId);
      return seat;
    });
  }
}
