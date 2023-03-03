import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import {
  CreatePriceListDto,
  FilterPriceListDto,
  UpdatePriceListDto,
  DeletePriceListDto,
  CreatePriceDetailDto,
  FilterPriceDetailDto,
} from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  async createPriceList(@Body() dto: CreatePriceListDto, @CurrentUser() user) {
    return await this.priceListService.createPriceList(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPriceList(
    @Query() dto: FilterPriceListDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.priceListService.findAllPriceList(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPriceListById(@Param('id') id: string) {
    return await this.priceListService.getPriceListById(id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePriceListById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdatePriceListDto,
  ) {
    return await this.priceListService.updatePriceListById(user.id, id, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePriceListById(@CurrentUser() user, @Param('id') id: string) {
    return await this.priceListService.deletePriceListById(id, user.id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePriceListByIds(
    @CurrentUser() user,
    @Body() dto: DeletePriceListDto,
  ) {
    return await this.priceListService.deleteMultiPriceListByIds(user.id, dto);
  }

  @Post('price-detail')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPriceDetail(
    @CurrentUser() user,
    @Body() dto: CreatePriceDetailDto,
  ) {
    return await this.priceListService.createPriceDetail(dto, user.id);
  }

  @Get('price-detail')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPriceDetail(
    @Query() dto: FilterPriceDetailDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.priceListService.findAllPriceDetail(dto, pagination);
  }

  @Get('price-detail/id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPriceDetailById(@Param('id') id: string) {
    return await this.priceListService.getPriceDetailById(id);
  }

  @Patch('price-detail/id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePriceDetailById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto,
  ) {
    return { message: 'coming soon' };
  }

  @Delete('price-detail/id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePriceDetailById(@CurrentUser() user, @Param('id') id: string) {
    return { message: 'coming soon' };
  }

  @Delete('price-detail/multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePriceDetailByIds(@CurrentUser() user, @Body() dto) {
    return { message: 'coming soon' };
  }
}