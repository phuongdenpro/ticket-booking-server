import { ProvinceService } from './../province/province.service';
import { District } from './../../../database/entities/vi-address-district.entities';
import { DistrictService } from './district.service';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { GetPagination, Pagination } from 'src/decorator';
import { DataSource } from 'typeorm';

@Controller('district')
export class DistrictController {
  constructor(
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    private dataSource: DataSource,
  ) {}

  // // crawl data
  // @Get('crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData(@GetPagination() pagination?: Pagination) {
  //   pagination.pageSize = 63;
  //   const provinces = await this.provinceService.findAll(pagination);
  //   provinces.dataResult.forEach(async (element) => {
  //     const url = `https://provinces.open-api.vn/api/p/${element.code}?depth=2`;
  //     const data = await axios.get(url);

  //     data.data.districts.forEach(async (e) => {
  //       const district = new District();
  //       district.name = e.name;
  //       district.code = e.code;
  //       district.type = e.division_type;
  //       district.nameWithType = e.codename;
  //       district.provinceCode = element.code;
  //       district.parentCode = element.id;
  //       await this.districtService.create(district);
  //     });
  //   });
  //   return provinces;
  // }
}
