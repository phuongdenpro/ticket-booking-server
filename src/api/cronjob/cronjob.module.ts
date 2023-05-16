import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { CronjobController } from './cronjob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  Staff,
  Customer,
  OrderRefund,
  PaymentHistory,
  PromotionHistory,
  PromotionLine,
} from './../../database/entities';
import { AdminService } from './../admin/admin.service';
import { CustomerService } from './../customer/customer.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentHistoryService } from '../payment-history/payment-history.service';
import { PromotionHistoryService } from '../promotion-history/promotion-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderRefund,
      Staff,
      Customer,
      PaymentHistory,
      PromotionHistory,
      PromotionLine,
    ]),
  ],
  providers: [
    CronjobService,
    PaymentService,
    CustomerService,
    AdminService,
    PaymentHistoryService,
    PromotionHistoryService,
  ],
  controllers: [CronjobController],
  exports: [CronjobService],
})
export class CronjobModule {}
