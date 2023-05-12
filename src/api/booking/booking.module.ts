import { SeatService } from './../seat/seat.service';
import {
  Seat,
  Ticket,
  TicketDetail,
  Promotion,
  Order,
  OrderDetail,
  Staff,
  Customer,
  TripDetail,
  PriceList,
  PriceDetail,
  PromotionLine,
  PromotionDetail,
  PromotionHistory,
  OrderRefund,
  OrderRefundDetail,
  PaymentHistory,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { OrderService } from '../order/order.service';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { PromotionLineService } from '../promotion-line/promotion-line.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentHistoryService } from '../payment-history/payment-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seat,
      Ticket,
      TicketDetail,
      Promotion,
      Order,
      OrderDetail,
      OrderRefund,
      OrderRefundDetail,
      Staff,
      Customer,
      TripDetail,
      PriceList,
      PriceDetail,
      Promotion,
      PromotionLine,
      PromotionDetail,
      PromotionHistory,
      PaymentHistory,
    ]),
  ],
  providers: [
    BookingService,
    PaymentService,
    OrderService,
    CustomerService,
    AdminService,
    SeatService,
    TicketService,
    PriceListService,
    PromotionLineService,
    PromotionHistoryService,
    PaymentHistoryService,
  ],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
