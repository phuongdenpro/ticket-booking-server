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
import { TripService } from './trip.service';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { DeleteDtoTypeEnum, RoleEnum } from './../../enums';
import { JwtAuthGuard } from './../../auth/guards';
import {
  FilterTripDto,
  CreateTripDto,
  UpdateTripDto,
  TripDeleteMultiInput,
} from './dto';

@Controller('trip')
@ApiTags('Trip')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPromotionStatusEnum() {
    return await this.tripService.getTripStatus();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewVehicle(@Body() dto: CreateTripDto, @CurrentUser() user) {
    return await this.tripService.createTrip(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterTripDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.tripService.findAllTrip(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getTripById(@Param('id') id: string) {
    return await this.tripService.findOneTripById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getTripByCode(@Param('code') code: string) {
    return await this.tripService.getTripByCode(code);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTripDto,
  ) {
    return await this.tripService.updateTripByIdOrCode(dto, user.id, id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateTripDto,
  ) {
    return await this.tripService.updateTripByIdOrCode(
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
  async deleteTripById(@CurrentUser() user, @Param('id') id: string) {
    return await this.tripService.deleteTripByIdOrCode(user.id, id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTripByCode(@CurrentUser() user, @Param('code') code: string) {
    return await this.tripService.deleteTripByIdOrCode(
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
  async deleteMultiple(@CurrentUser() user, @Body() dto: TripDeleteMultiInput) {
    return await this.tripService.deleteMultipleTripByIdsOrCodes(
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
  async deleteMultipleByCodes(
    @CurrentUser() user,
    @Body() dto: TripDeleteMultiInput,
  ) {
    return await this.tripService.deleteMultipleTripByIdsOrCodes(
      user.id,
      dto,
      DeleteDtoTypeEnum.CODE,
    );
  }
}
