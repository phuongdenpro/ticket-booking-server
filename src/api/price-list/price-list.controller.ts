import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { CreatePriceListDto, FilterPriceListDto } from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PriceListService } from './price-list.service';

@Controller('price-list')
@ApiTags('Price List')
export class PriceListController {
  constructor(private priceListService: PriceListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createCustomerGroup(
    @Body() dto: CreatePriceListDto,
    @CurrentUser() user,
  ) {
    return await this.priceListService.createPriceList(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCustomerGroup(@Param('id') id: string) {
    return await this.priceListService.getPriceListById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterPriceListDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.priceListService.findAllPriceList(dto, pagination);
  }
}
