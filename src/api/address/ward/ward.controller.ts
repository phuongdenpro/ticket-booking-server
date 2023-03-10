import { RoleEnum } from './../../../enums/roles.enum';
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
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../../decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../../../auth/guards';
import {
  UpdateWardDto,
  FilterWardDto,
  SaveWardDto,
  WardDeleteMultiId,
  WardDeleteMultiCode,
} from './dto';
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
  async create(@Body() dto: SaveWardDto, @CurrentUser() user) {
    return await this.wardService.save(dto, user.id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(
    @Param('id') id: number,
    @Body() dto: UpdateWardDto,
    @CurrentUser() user,
  ) {
    return await this.wardService.updateById(id, dto, user.id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(
    @Param('code') code: number,
    @Body() dto: UpdateWardDto,
    @CurrentUser() user,
  ) {
    return await this.wardService.updateByCode(code, dto, user.id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteByCode(@Param('code') code: number, @CurrentUser() user) {
    return await this.wardService.deleteByCode(code, user.id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteById(@Param('id') id: number, @CurrentUser() user) {
    return await this.wardService.deleteById(id, user.id);
  }

  @Delete('multiple/id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleId(@CurrentUser() user, @Body() dto: WardDeleteMultiId) {
    return await this.wardService.deleteMultipleWardById(user.id, dto);
  }

  @Delete('multiple/code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleCode(
    @CurrentUser() user,
    @Body() dto: WardDeleteMultiCode,
  ) {
    return await this.wardService.deleteMultipleWardByCode(user.id, dto);
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

  // @Get('crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData(@GetPagination() pagination?: Pagination) {
  //   const districts = await this.districtService.findAll({}, pagination);
  //   districts.dataResult.forEach(async (district) => {
  //     console.log(district.code);
  //     const url = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
  //     const response = await axios.get(url);
  //     response.data.wards.forEach(async (ward) => {
  //       const oldWard = this.wardService.findOneByCode(ward.code);
  //       console.log(ward.codename);
  //       if (!(await oldWard).dataResult.codename) {
  //         const dto = new UpdateWardDto();
  //         dto.codename = ward.codename;
  //         const saveWard = await this.wardService.updateByCode(
  //           ward.code,
  //           dto,
  //           '08926136-26d8-4176-827e-060cc7e6285d',
  //         );
  //         console.log(saveWard);
  //       }
  //     });
  //   });
  // }
}
