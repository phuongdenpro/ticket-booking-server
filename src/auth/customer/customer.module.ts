import { CustomerService } from '../../api/customer/customer.service';
import { CustomerModule } from '../../api/customer/customer.module';
import { Customer } from '../../database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { AuthCustomerController } from './customer.controller';
import { AuthCustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CustomerModule],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService, AuthService, CustomerService],
  exports: [AuthCustomerService],
})
export class AuthCustomerModule {}
