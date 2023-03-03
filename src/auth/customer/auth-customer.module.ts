import { UserService } from './../../api/user/user.service';
import { CustomerService } from '../../api/customer/customer.service';
import { CustomerModule } from '../../api/customer/customer.module';
import { Customer } from '../../database/entities';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { AuthCustomerController } from './auth-customer.controller';
import { AuthCustomerService } from './auth-customer.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CustomerModule],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService, AuthService, CustomerService, UserService],
  exports: [AuthCustomerService],
})
export class AuthCustomerModule {}
