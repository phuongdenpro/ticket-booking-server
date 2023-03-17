import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupController } from './customer-group.controller';
import { Customer, CustomerGroup, Staff } from './../../database/entities';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerGroup, Staff, Customer])],
  providers: [CustomerGroupService, AdminService, CustomerService],
  controllers: [CustomerGroupController],
  exports: [CustomerGroupService],
})
export class CustomerGroupModule {}
