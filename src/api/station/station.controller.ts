import { RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { StationService } from './station.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './../../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FilterStationDto,
  SaveStationDto,
  DeleteStationByIdsDto,
  UpdateStationDto,
  DeleteStationByCodesDto,
} from './dto';
import { Patch, Res } from '@nestjs/common/decorators';
import { Response } from 'express';

@Controller('station')
@ApiTags('Station')
export class StationController {
  constructor(private stationService: StationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewStation(@Body() dto: SaveStationDto, @CurrentUser() user) {
    return await this.stationService.createStation(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getStationById(@Param('id') id: string) {
    return await this.stationService.findOneStationById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getStationByCode(@Param('code') code: string) {
    return await this.stationService.findOneStationByCode(code);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterStationDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.stationService.findAll(dto, pagination);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateStationDto,
  ) {
    return await this.stationService.updateStationById(user.id, id, dto);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateStationDto,
  ) {
    return await this.stationService.updateStationByCode(user.id, code, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.stationService.deleteStationById(user.id, id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStationByCode(@CurrentUser() user, @Param('code') code: string) {
    return await this.stationService.deleteStationByCode(user.id, code);
  }

  @Delete('multiple/ids')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleStationByIds(
    @CurrentUser() user,
    @Body() dto: DeleteStationByIdsDto,
  ) {
    return await this.stationService.deleteMultipleStationByIds(user.id, dto);
  }

  @Delete('multiple/codes')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleStationByCodes(
    @CurrentUser() user,
    @Body() dto: DeleteStationByCodesDto,
  ) {
    return await this.stationService.deleteMultipleStationByCodes(user.id, dto);
  }

  @Post('export')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async export(@Query() dto: FilterStationDto, @Res() res: Response) {
    return await this.stationService.exportStation(dto, res);
  }
}
