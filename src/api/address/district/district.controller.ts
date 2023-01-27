import { FilterDistrictDto } from './dto/filter-district.dto';
import { DistrictService } from './district.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { GetPagination, Pagination } from 'src/decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('district')
@ApiTags('District')
export class DistrictController {
  constructor(private districtService: DistrictService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterDistrictDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.districtService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Param('id') id: string,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.districtService.findOneById(id, pagination);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(
    @Param('code') code: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.districtService.findOneByCode(code, pagination);
  }

  @Get('district-code/:districtCode')
  @HttpCode(HttpStatus.OK)
  async findOneByProvinceCode(
    @Param('districtCode') districtCode: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.districtService.findOneByProvinceCode(districtCode, pagination);
  }

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
