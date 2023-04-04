import { RoleEnum } from './../../enums';
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
import { SeatService } from './seat.service';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { JwtAuthGuard } from './../../auth/guards';
import {
  FilterSeatDto,
  CreateSeatDto,
  SeatDeleteMultiInput,
  UpdateSeatDto,
} from './dto';

@Controller('seat')
@ApiTags('Seat')
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createSeat(@Body() dto: CreateSeatDto, @CurrentUser() user) {
    return await this.seatService.createSeat(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getSeatById(@Param('id') id: string) {
    return await this.seatService.getSeatById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getSeatByCode(@Param('code') code: string) {
    return await this.seatService.getSeatByCode(code);
  }

  @Get('vehicle/:id')
  @HttpCode(HttpStatus.OK)
  async getSeatByVehicleId(
    @Param('id') vehicleId: string,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.seatService.findAllSeatByVehicleId(vehicleId, pagination);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async searchSeat(
    @Query() dto: FilterSeatDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.seatService.searchSeat(dto, pagination);
  }

  @Get('search/vehicle/:id')
  @HttpCode(HttpStatus.OK)
  async searchSeatWithVehicleId(
    @Param('id') vehicleId: string,
    @Query() dto: FilterSeatDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.seatService.searchSeatWithVehicleId(
      dto,
      vehicleId,
      pagination,
    );
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateSeatById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateSeatDto,
  ) {
    return await this.seatService.updateSeatByIdOrCode(dto, user.id, id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateSeatByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateSeatDto,
  ) {
    return await this.seatService.updateSeatByIdOrCode(
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
  async deleteStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.seatService.deleteSeatByIdOrCode(user.id, id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStationByCode(@CurrentUser() user, @Param('code') code: string) {
    return await this.seatService.deleteSeatByIdOrCode(
      user.id,
      undefined,
      code,
    );
  }

  @Delete('multiple/ids')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleByIds(
    @CurrentUser() user,
    @Body() dto: SeatDeleteMultiInput,
  ) {
    return await this.seatService.deleteMultipleTripById(user.id, dto);
  }

  @Delete('multiple/codes')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleByCodes(
    @CurrentUser() user,
    @Body() dto: SeatDeleteMultiInput,
  ) {
    return await this.seatService.deleteMultipleTripByCode(user.id, dto);
  }
}
