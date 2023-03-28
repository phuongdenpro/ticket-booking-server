import { JwtAuthGuard } from './../../../auth/guards';
import { RoleEnum, DeleteDtoTypeEnum } from './../../../enums';
import { DistrictService } from './district.service';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../../decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SaveDistrictDto,
  UpdateDistrictDto,
  FilterDistrictDto,
  DistrictDeleteMultiByIdsOrCodes,
} from './dto';
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
  async findOneById(@Param('id') id: string) {
    return this.districtService.findOneById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(@Param('code') code: number) {
    return this.districtService.findOneByCode(code);
  }

  @Get('province-code/:provinceCode')
  @HttpCode(HttpStatus.OK)
  async findByProvinceCode(
    @Param('provinceCode') provinceCode: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.districtService.findByProvinceCode(provinceCode, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: SaveDistrictDto, @CurrentUser() user) {
    return this.districtService.createDistrict(dto, user.id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateDistrictDto,
    @CurrentUser() user,
  ) {
    return this.districtService.updateByIdOrCode(dto, user.id, id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(
    @Param('code') code: number,
    @Body() dto: UpdateDistrictDto,
    @CurrentUser() user,
  ) {
    return this.districtService.updateByIdOrCode(dto, user.id, undefined, code);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenByCode(@Param('code') code: number, @CurrentUser() user) {
    return this.districtService.deleteByIdOrCode(user.id, undefined, code);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenById(@Param('id') id: string, @CurrentUser() user) {
    return this.districtService.deleteByIdOrCode(user.id, id);
  }

  @Delete('multiple/id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleId(
    @CurrentUser() user,
    @Body() dto: DistrictDeleteMultiByIdsOrCodes,
  ) {
    return await this.districtService.deleteMultipleDistrictByIdsOrCodes(
      user.id,
      dto,
      DeleteDtoTypeEnum.ID,
    );
  }

  @Delete('multiple/code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleCode(
    @CurrentUser() user,
    @Body() dto: DistrictDeleteMultiByIdsOrCodes,
  ) {
    return await this.districtService.deleteMultipleDistrictByIdsOrCodes(
      user.id,
      dto,
      DeleteDtoTypeEnum.CODE,
    );
  }

  // crawl data
  // @Get('crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData(@GetPagination() pagination?: Pagination) {
  //   const districts = await this.districtService.findAll({}, pagination);
  //   console.log(districts.dataResult);
  //   districts.dataResult.forEach(async (district) => {
  //     const url = `https://provinces.open-api.vn/api/d/${district.code}`;
  //     const response = await axios.get(url);

  //     const dto = new UpdateDistrictDto();
  //     dto.codename = response.data.codename;
  //     await this.districtService.updateByCode(
  //       district.code,
  //       dto,
  //       '08926136-26d8-4176-827e-060cc7e6285d',
  //     );
  //   });
  // }
}
