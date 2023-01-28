import { HiddenProvinceDto } from './dto/hidden-province.dto';
import { SaveProvinceDto } from './dto/save-province.dto';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { GetPagination, Pagination, Roles } from 'src/decorator';
import { FilterProvinceDto } from './dto/filter-province.dto';
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('province')
@ApiTags('Province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterProvinceDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.provinceService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Param('id') id: string,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.provinceService.findOneById(id, pagination);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(
    @Param('code') code: number,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.provinceService.findOneByCode(code, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: SaveProvinceDto) {
    return this.provinceService.save(dto);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(@Param('id') id: string, @Body() dto: SaveProvinceDto) {
    return this.provinceService.updateById(id, dto);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(
    @Param('code') code: number,
    @Body() dto: SaveProvinceDto,
  ) {
    return this.provinceService.updateByCode(code, dto);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenByCode(
    @Param('code') code: number,
    @Body() dto: HiddenProvinceDto,
  ) {
    return this.provinceService.hiddenByCode(code, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenById(@Param('id') id: string, @Body() dto: HiddenProvinceDto) {
    return this.provinceService.hiddenById(id, dto);
  }

  // @Get('/crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData() {
  //   const url = 'https://provinces.open-api.vn/api/p/';
  //   const data = await axios.get(url);
  //   data.data.forEach(async (element) => {
  //     const province = new Province();
  //     province.name = element.name;
  //     province.code = element.code;
  //     province.type = element.division_type;
  //     province.nameWithType = element.codename;
  //     this.provinceService.create(province);
  //   });

  //   return { demo: 'hello' };
  // }
}
