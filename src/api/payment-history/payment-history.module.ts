import { Module } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Customer,
  Order,
  PaymentHistory,
  Staff,
} from './../../database/entities';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentHistory, Staff, Customer, Order])],
  providers: [PaymentHistoryService, AdminService, CustomerService],
  controllers: [PaymentHistoryController],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
