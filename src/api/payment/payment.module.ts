import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Order, OrderRefund, Staff } from './../../database/entities';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderRefund, Staff, Customer])],
  providers: [PaymentService, CustomerService, AdminService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
