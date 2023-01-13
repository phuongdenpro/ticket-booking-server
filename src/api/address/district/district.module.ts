import { ProvinceService } from './../province/province.service';
import { Province, District } from 'src/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';

@Module({
  imports: [TypeOrmModule.forFeature([District, Province])],
  controllers: [DistrictController],
  providers: [DistrictService, ProvinceService],
  exports: [DistrictService, ProvinceService],
})
export class DistrictModule {}
