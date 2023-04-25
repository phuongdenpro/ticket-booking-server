import { PaymentService } from './../payment/payment.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto';
import { CreateOrderDto } from '../order/dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  async booking(dto: CreateBookingDto, userId: string) {
    const { seatIds, seatCodes, tripDetailCode, promotionLineCodes } = dto;
    const dtoOrder = new CreateOrderDto();
    if (!seatCodes && !seatIds) {
      throw new BadRequestException('SEAT_IDS_OR_SEAT_CODES_REQUIRED');
    }
    if (seatIds && seatIds.length > 0) {
      dtoOrder.seatIds = seatIds;
    } else if (seatCodes && seatCodes.length > 0) {
      dtoOrder.seatCodes = seatCodes;
    }
    dtoOrder.tripDetailCode = tripDetailCode;
    dtoOrder.note = '';
    dtoOrder.customerId = userId;
    dtoOrder.promotionLineCodes = promotionLineCodes;
    const order = await this.orderService.createOrder(dtoOrder, userId);
    return order;
  }

  async getZaloPayPaymentUrl(orderCode: string, userId: string) {
    return await this.paymentService.getZaloPayPaymentUrl(orderCode, userId);
  }
}
