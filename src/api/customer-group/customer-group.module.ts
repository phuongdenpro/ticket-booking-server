import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupController } from './customer-group.controller';
import {
  CustomerGroup,
  CustomerGroupDetail,
  Staff,
} from './../../database/entities';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerGroup, CustomerGroupDetail, Staff]),
  ],
  providers: [CustomerGroupService, AdminService],
  controllers: [CustomerGroupController],
  exports: [CustomerGroupService],
})
export class CustomerGroupModule {}
