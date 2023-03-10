import { AuthService } from './../../auth/auth.service';
import { Staff, Customer } from '../../database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Customer])],
  controllers: [CustomerController],
  providers: [CustomerService, AuthService],
  exports: [CustomerService],
})
export class CustomerModule {}
