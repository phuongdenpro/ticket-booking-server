import { HiddenWardDto } from './dto/hidden-ward.dto';
import { SaveWardDto } from './dto/save-ward.dto';
import { FilterWardDto } from './dto/filter-ward.dto';
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
import { WardService } from './ward.service';
import { DataSource } from 'typeorm';
import { GetPagination, Pagination, Roles } from 'src/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';

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
    return await this.wardService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return await this.wardService.findOneById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(@Param('code') code: number) {
    return await this.wardService.findOneByCode(code);
  }

  @Get('district-code/:districtCode')
  @HttpCode(HttpStatus.OK)
  async findByDistrictCode(
    @Param('districtCode') districtCode: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.wardService.findByDistrictCode(districtCode, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: SaveWardDto) {
    return await this.wardService.save(dto);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(@Param('id') id: number, @Body() dto: SaveWardDto) {
    return await this.wardService.updateById(id, dto);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(@Param('code') code: number, @Body() dto: SaveWardDto) {
    return await this.wardService.updateByCode(code, dto);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenByCode(@Param('code') code: number, @Body() dto: HiddenWardDto) {
    return await this.wardService.hiddenByCode(code, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenById(@Param('id') id: number, @Body() dto: HiddenWardDto) {
    return await this.wardService.hiddenById(id, dto);
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
