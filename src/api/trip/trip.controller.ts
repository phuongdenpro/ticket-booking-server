import { TripDeleteMultiInput } from './dto/delete-multiple-input-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
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
import { CurrentUser, GetPagination, Pagination, Roles } from 'src/decorator';
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';
import { FilterTripDto, SaveTripDto } from './dto';

@Controller('trip')
@ApiTags('Trip')
export class TripController {
  constructor(private tripService: TripService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewVehicle(@Body() dto: SaveTripDto, @CurrentUser() user) {
    return await this.tripService.saveTrip(dto, user.id);
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

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTripDto,
  ) {
    return await this.tripService.updateTripById(id, dto, user.id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.tripService.deleteTripById(id, user.id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiple(@CurrentUser() user, @Body() dto: TripDeleteMultiInput) {
    return await this.tripService.deleteMultipleTrip(user.id, dto);
  }
}
