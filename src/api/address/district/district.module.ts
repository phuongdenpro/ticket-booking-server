import { AdminService } from './../../admin/admin.service';
import { Province, District, Staff } from './../../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';

@Module({
  imports: [TypeOrmModule.forFeature([District, Province, Staff])],
  controllers: [DistrictController],
  providers: [DistrictService, AdminService],
  exports: [DistrictService],
})
export class DistrictModule {}
