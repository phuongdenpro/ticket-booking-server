import {
  Staff,
  Customer,
  Ward,
  District,
  Province,
  CustomerGroup,
} from '../../database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      Customer,
      CustomerGroup,
      Ward,
      District,
      Province,
    ]),
  ],

  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
