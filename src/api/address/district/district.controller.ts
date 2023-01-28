import { FilterDistrictDto } from './dto/filter-district.dto';
import { DistrictService } from './district.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetPagination, Pagination, Roles } from 'src/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';
import { SaveDistrictDto } from './dto/save-district.dto';
import { HiddenDistrictDto } from './dto';

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
    return this.districtService.findByProvinceCode(districtCode, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: SaveDistrictDto) {
    return this.districtService.save(dto);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(@Param('id') id: string, @Body() dto: SaveDistrictDto) {
    return this.districtService.updateById(id, dto);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(
    @Param('code') code: number,
    @Body() dto: SaveDistrictDto,
  ) {
    return this.districtService.updateByCode(code, dto);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenByCode(
    @Param('code') code: number,
    @Body() dto: HiddenDistrictDto,
  ) {
    return this.districtService.hiddenByCode(code, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenById(@Param('id') id: string, @Body() dto: HiddenDistrictDto) {
    return this.districtService.hiddenById(id, dto);
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
