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
import axios from 'axios';
import { District, Ward } from './../../../database/entities';
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
  async findOneById(@Param('id') id: number) {
    return await this.wardService.getWardById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(@Param('code') code: number) {
    return await this.wardService.getWardByCode(code);
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
    return await this.wardService.createWard(dto, user.id);
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
  @Get('crawl2')
  @HttpCode(HttpStatus.OK)
  async crawlData2(@GetPagination() pagination?: Pagination) {
    const districts = await this.dataSource.getRepository(District).find({
      order: {
        code: 'ASC',
      },
      skip: pagination.skip,
      take: pagination.take,
    });
    districts.forEach(async (element) => {
      const url = `https://provinces.open-api.vn/api/d/${element.code}?depth=2`;
      const response = await axios.get(url);

      response.data.wards.forEach(async (e) => {
        // const dto = new SaveWardDto();
        // dto.name = e.name;
        // dto.code = e.code;
        // dto.type = e.division_type;
        // dto.codename = e.codename;
        // dto.districtCode = element.code;
        // await this.wardService.createWard(
        //   dto,
        //   '08926136-26d8-4176-827e-060cc7e6285d',
        // );
        if (e.code) {
          const w = await this.wardService.findOneByCode(e.code);
          if (!w) {
            const ward = new Ward();
            ward.name = e.name;
            ward.code = e.code;
            ward.type = e.division_type;
            ward.codename = e.codename;
            ward.districtCode = element.code;
            ward.district = element;
            ward.createdBy = '08926136-26d8-4176-827e-060cc7e6285d';
            await this.dataSource.getRepository(Ward).save(ward);
          }
        }
      });
    });
  }

  @Get('crawl')
  @HttpCode(HttpStatus.OK)
  async crawlData(@GetPagination() pagination?: Pagination) {
    const districts = await this.dataSource.getRepository(District).find({
      order: {
        code: 'ASC',
      },
      skip: pagination.skip,
      take: pagination.take,
    });
    districts.forEach(async (district) => {
      console.log(district.code);
      const url = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
      const response = await axios.get(url);
      response.data.wards.forEach(async (ward) => {
        const oldWard = await this.wardService.findOneByCode(ward.code);
        console.log(ward.codename);
        if (!oldWard) {
          const dto = new SaveWardDto();
          dto.name = ward.name;
          dto.code = ward.code;
          dto.type = ward.division_type;
          dto.codename = ward.codename;
          dto.districtCode = district.code;
          const saveWard = await this.wardService.createWard(
            dto,
            '08926136-26d8-4176-827e-060cc7e6285d',
          );
        }
      });
    });
  }
}
