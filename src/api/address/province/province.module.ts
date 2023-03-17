import { Staff, Province } from './../../../database/entities';
import { AdminService } from './../../admin/admin.service';
import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Province, Staff])],
  providers: [ProvinceService, AdminService],
  controllers: [ProvinceController],
  exports: [ProvinceService],
})
export class ProvinceModule {}
