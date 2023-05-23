import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Customer,
  Order,
  OrderRefund,
  PaymentHistory,
  PromotionHistory,
  PromotionLine,
  Staff,
} from './../../database/entities';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { PaymentHistoryService } from '../payment-history/payment-history.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderRefund,
      PaymentHistory,
      Staff,
      Customer,
      PromotionHistory,
      PromotionLine,
    ]),
  ],
  providers: [
    PaymentService,
    CustomerService,
    AdminService,
    PaymentHistoryService,
    PromotionHistoryService,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
