import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupController } from './customer-group.controller';
import { CustomerGroup, CustomerGroupDetail } from './../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerGroup, CustomerGroupDetail])],
  providers: [CustomerGroupService],
  controllers: [CustomerGroupController],
  exports: [CustomerGroupService],
})
export class CustomerGroupModule {}
