import { AdminService } from './../admin/admin.service';
import { CustomerService } from './../customer/customer.service';
import { Customer } from './../../database/entities/customer.entities';
import { WardService } from './../address/ward/ward.service';
import { ProvinceService } from './../address/province/province.service';
import { DistrictService } from './../address/district/district.service';
import { ImageResourceService } from './../image-resource/image-resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import {
  ImageResource,
  Station,
  Ward,
  Staff,
  District,
  Province,
} from './../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Station,
      Ward,
      District,
      Province,
      ImageResource,
      Staff,
      Customer,
    ]),
  ],
  controllers: [StationController],
  providers: [
    StationService,
    ImageResourceService,
    WardService,
    DistrictService,
    ProvinceService,
    AdminService,
    CustomerService,
  ],
  exports: [StationService],
})
export class StationModule {}
