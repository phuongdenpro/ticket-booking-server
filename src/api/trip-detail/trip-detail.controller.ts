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
import { DeleteDtoTypeEnum, RoleEnum } from './../../enums';
import { TripDetailService } from './trip-detail.service';
import {
  FilterTripDetailDto,
  CreateTripDetailDto,
  TripDetailDeleteMultiInput,
  UpdateTripDetailDto,
  BusScheduleDto,
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
  async createTripDetail(
    @Body() dto: CreateTripDetailDto,
    @CurrentUser() user,
  ) {
    return await this.tripDetailService.createTripDetail(dto, user.id);
  }

  @Get('bus-schedule')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getBusSchedule(
    @CurrentUser() user,
    @Query() dto: BusScheduleDto,
  ) {
    return await this.tripDetailService.getBusSchedule(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterTripDetailDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.tripDetailService.findAllTripDetail(dto, pagination);
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
    return await this.tripDetailService.updateTripDetailByIdOrCode(
      dto,
      user.id,
      id,
    );
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
    return await this.tripDetailService.updateTripDetailByIdOrCode(
      dto,
      user.id,
      undefined,
      code,
    );
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTripDetailById(@CurrentUser() user, @Param('id') id: string) {
    return await this.tripDetailService.deleteTripDetailByIdOrCode(user.id, id);
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
    return await this.tripDetailService.deleteTripDetailByIdOrCode(
      user.id,
      undefined,
      code,
    );
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
    return await this.tripDetailService.deleteMultipleTripDetailByIdsOrCodes(
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
  async deleteMultipleTripDetailByCode(
    @CurrentUser() user,
    @Body() dto: TripDetailDeleteMultiInput,
  ) {
    return await this.tripDetailService.deleteMultipleTripDetailByIdsOrCodes(
      user.id,
      dto,
      DeleteDtoTypeEnum.CODE,
    );
  }
}
