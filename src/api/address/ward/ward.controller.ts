import { FilterWardDto } from './dto/filter-ward.dto';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { WardService } from './ward.service';
import { DataSource } from 'typeorm';
import { GetPagination, Pagination } from 'src/decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('ward')
@ApiTags('Ward')
export class WardController {
  constructor(
    private wardService: WardService,
    private dataSource: DataSource,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterWardDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.wardService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Param('id') id: string,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.wardService.findOneById(id, pagination);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(
    @Param('code') code: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.wardService.findOneByCode(code, pagination);
  }

  @Get('district-code/:districtCode')
  @HttpCode(HttpStatus.OK)
  async findOneByDistrictCode(
    @Param('districtCode') districtCode: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.wardService.findOneByDistrictCode(districtCode, pagination);
  }

  // crawl data
  // @Get('crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData(@GetPagination() pagination?: Pagination) {
  //   pagination.pageSize = 1000;
  //   const provinces = await this.wardService.findAll(pagination);
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
