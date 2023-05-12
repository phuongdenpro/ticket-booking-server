import { Module } from '@nestjs/common';
import { CallbackService } from './callback.service';
import { CallbackController } from './callback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  Staff,
  Customer,
  PaymentHistory,
} from './../../database/entities';
import { PaymentHistoryService } from '../payment-history/payment-history.service';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Staff, Customer, PaymentHistory])],
  providers: [
    CallbackService,
    PaymentHistoryService,
    AdminService,
    CustomerService,
  ],
  controllers: [CallbackController],
  exports: [CallbackService],
})
export class CallbackModule {}
