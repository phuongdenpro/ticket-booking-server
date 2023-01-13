import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { WardService } from './ward.service';
import { DistrictService } from '../district/district.service';
import { DataSource } from 'typeorm';
import { GetPagination, Pagination } from 'src/decorator';
import axios from 'axios';
import { Ward } from 'src/database/entities';

@Controller('ward')
export class WardController {
  constructor(
    private wardService: WardService,
    private districtService: DistrictService,
    private dataSource: DataSource,
  ) {}

  // crawl data
  // @Get('crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData(@GetPagination() pagination?: Pagination) {
  //   pagination.pageSize = 1000;
  //   const provinces = await this.districtService.findAll(pagination);
  //   provinces.dataResult.forEach(async (element) => {
  //     const url = `https://provinces.open-api.vn/api/d/${element.code}?depth=2`;
  //     const data = await axios.get(url);

  //     data.data.wards.forEach(async (e) => {
  //       const ward = new Ward();
  //       ward.name = e.name;
  //       ward.code = e.code;
  //       ward.type = e.division_type;
  //       ward.nameWithType = e.codename;
  //       ward.provinceCode = element.code;
  //       ward.parentCode = element.id;
  //       await this.wardService.create(ward);
  //     });
  //   });
  //   return provinces;
  // }
}
