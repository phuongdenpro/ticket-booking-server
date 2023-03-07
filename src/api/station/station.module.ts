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
    ]),
  ],
  controllers: [StationController],
  providers: [
    StationService,
    ImageResourceService,
    WardService,
    DistrictService,
    ProvinceService,
  ],
  exports: [StationService],
})
export class StationModule {}
