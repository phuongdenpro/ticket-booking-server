import { AuthService } from './../../auth/auth.service';
import { UserService } from './user.service';
import { AuthCustomerService } from './../../auth/customer/auth-customer.service';
import { Customer } from './../../database/entities';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [UserService, CustomerService, AuthCustomerService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
