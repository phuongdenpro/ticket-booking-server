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
import { JwtAuthGuard } from './../../auth/guards';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { RoleEnum } from './../../enums';
import { TripDetailService } from './trip-detail.service';
import {
  FilterTripDetailDto,
  CreateTripDetailDto,
  TripDetailDeleteMultiInput,
  UpdateTripDetailDto,
} from './dto';

@Controller('trip-detail')
@ApiTags('Trip Detail')
export class TripDetailController {
  constructor(private tripDetailService: TripDetailService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createTripDetail(@Body() dto: CreateTripDetailDto, @CurrentUser() user) {
    return await this.tripDetailService.createTripDetail(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterTripDetailDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.tripDetailService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getTripDetailById(@Param('id') id: string) {
    return await this.tripDetailService.getTripDetailById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getTripDetailByCode(@Param('code') code: string) {
    return await this.tripDetailService.getTripDetailByCode(code);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripDetailById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTripDetailDto,
  ) {
    return await this.tripDetailService.updateTripDetailById(dto, id, user.id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripDetailByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateTripDetailDto,
  ) {
    return await this.tripDetailService.updateTripDetailById(
      dto,
      code,
      user.id,
    );
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTripDetailById(@CurrentUser() user, @Param('id') id: string) {
    return await this.tripDetailService.deleteTripDetailById(id, user.id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTripDetailByCode(
    @CurrentUser() user,
    @Param('code') code: string,
  ) {
    return await this.tripDetailService.deleteTripDetailByCode(code, user.id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleTripDetailByIds(
    @CurrentUser() user,
    @Body() dto: TripDetailDeleteMultiInput,
  ) {
    return await this.tripDetailService.deleteMultipleTripDetailByIds(
      user.id,
      dto,
    );
  }

  @Delete('multiple/code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleTripDetailByCode(
    @CurrentUser() user,
    @Body() dto: TripDetailDeleteMultiInput,
  ) {
    return await this.tripDetailService.deleteMultipleTripDetailByCodes(
      user.id,
      dto,
    );
  }
}
