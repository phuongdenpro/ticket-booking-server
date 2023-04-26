import { Module } from '@nestjs/common';
import { OrderRefundController } from './order-refund.controller';
import { OrderService } from '../order/order.service';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PriceListService } from '../price-list/price-list.service';
import { PromotionLineService } from '../promotion-line/promotion-line.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';
import { PaymentService } from '../payment/payment.service';
import {
  Customer,
  Order,
  OrderDetail,
  OrderRefund,
  OrderRefundDetail,
  PaymentHistory,
  PriceDetail,
  PriceList,
  Promotion,
  PromotionDetail,
  PromotionHistory,
  PromotionLine,
  Seat,
  Staff,
  Ticket,
  TicketDetail,
  Trip,
  TripDetail,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistoryService } from '../payment-history/payment-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      OrderRefund,
      OrderRefundDetail,
      Staff,
      Customer,
      Seat,
      Ticket,
      Trip,
      TicketDetail,
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
  controllers: [OrderRefundController],
  providers: [
    OrderService,
    AdminService,
    CustomerService,
    SeatService,
    TicketService,
    PriceListService,
    PromotionLineService,
    PromotionHistoryService,
    PaymentService,
    PaymentHistoryService,
  ],
})
export class OrderRefundModule {}
