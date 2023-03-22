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
  UpdatePriceDetailDto,
  DeletePriceDetailDto,
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

  // price list
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

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPriceListByCode(@Param('code') code: string) {
    return await this.priceListService.getPriceListByCode(code);
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

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePriceListByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdatePriceListDto,
  ) {
    return await this.priceListService.updatePriceListByCode(
      user.id,
      code,
      dto,
    );
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

  // price detail
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

  @Get('price-detail/code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPriceDetailByCode(@Param('code') code: string) {
    return await this.priceListService.getPriceDetailByCode(code);
  }

  @Patch('price-detail/id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePriceDetailById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdatePriceDetailDto,
  ) {
    return this.priceListService.updatePriceDetailById(user.id, id, dto);
  }

  @Patch('price-detail/code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePriceDetailByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdatePriceDetailDto,
  ) {
    return this.priceListService.updatePriceDetailByCode(user.id, code, dto);
  }

  @Delete('price-detail/id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePriceDetailById(@CurrentUser() user, @Param('id') id: string) {
    return await this.priceListService.deletePriceDetailById(user.id, id);
  }

  @Delete('price-detail/code/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePriceDetailByCode(
    @CurrentUser() user,
    @Param('code') code: string,
  ) {
    return await this.priceListService.deletePriceDetailByCode(user.id, code);
  }

  @Delete('price-detail/multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePriceDetailByIds(
    @CurrentUser() user,
    @Body() dto: DeletePriceDetailDto,
  ) {
    return await this.priceListService.deleteMultiPriceDetailByIds(
      user.id,
      dto,
    );
  }

  @Delete('price-detail/multiple/code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePriceDetailByCodes(
    @CurrentUser() user,
    @Body() dto: DeletePriceDetailDto,
  ) {
    return await this.priceListService.deleteMultiPriceDetailByCodes(
      user.id,
      dto,
    );
  }
}
