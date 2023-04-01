import { OrderStatusEnum } from './../../enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto';
import { CreateOrderDto } from '../order/dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class BookingService {
  constructor(private readonly orderService: OrderService) {}

  async booking(dto: CreateBookingDto, userId: string) {
    const { seatIds, seatCodes, tripDetailCode } = dto;
    const dtoOrder = new CreateOrderDto();
    if (seatIds) {
      dtoOrder.seatIds = seatIds;
    }
    if (seatCodes) {
      dtoOrder.seatCodes = seatCodes;
    }
    if (!seatCodes && !seatIds) {
      throw new BadRequestException('SEAT_IDS_OR_SEAT_CODES_REQUIRED');
    }
    dtoOrder.tripDetailCode = tripDetailCode;
    dtoOrder.status = OrderStatusEnum.UNPAID;
    dtoOrder.note = '';
    const order = await this.orderService.createOrder(dtoOrder, userId);
    return order;
  }

  // async payment() {}
}
