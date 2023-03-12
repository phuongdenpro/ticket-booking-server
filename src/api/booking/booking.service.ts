import { Customer, Staff } from './../../database/entities';
import { TripDetailService } from './../trip-detail/trip-detail.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBookingDto } from './dto';
import { SeatService } from './../seat/seat.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly tripDetailService: TripDetailService,
    // private readonly seatService: SeatService,
    private dataSource: DataSource,
  ) {}

  async booking(dto: CreateBookingDto, userId: string) {
    const { seatIds, tripDetailId } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    const customerExist = await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { id: userId } });
    if (!adminExist && !customerExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (adminExist.isActive === false || customerExist.status === 0) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    const tripDetailExists = await this.tripDetailService.getTripDetailById(
      tripDetailId,
    );
    // const seats = await seatIds.map(async (seatId) => {
    //   const seat = await this.seatService.getSeatById(seatId, {
    //     where: {
    //       vehicle: { id: tripDetailExists.vehicle.id },
    //     },
    //   });
    //   return seat;
    // });

    return { message: 'coming soon' };
  }
}
