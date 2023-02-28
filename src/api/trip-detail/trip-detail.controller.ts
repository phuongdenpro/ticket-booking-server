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
  SaveTripDetailDto,
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
  async createNewVehicle(@Body() dto: SaveTripDetailDto, @CurrentUser() user) {
    return await this.tripDetailService.saveTripDetail(dto, user.id);
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
  async getTripById(@Param('id') id: string) {
    return await this.tripDetailService.findOneTripDetailById(id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTripDetailDto,
  ) {
    return await this.tripDetailService.updateTripDetailById(dto, id, user.id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.tripDetailService.deleteTripDetailById(id, user.id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiple(
    @CurrentUser() user,
    @Body() dto: TripDetailDeleteMultiInput,
  ) {
    return await this.tripDetailService.deleteMultipleTripDetailByIds(
      user.id,
      dto,
    );
  }
}
