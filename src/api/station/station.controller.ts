import { CurrentUser, GetPagination, Pagination, Roles } from 'src/decorator';
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
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterStationDto, SaveStationDto } from './dto';
import { Patch } from '@nestjs/common/decorators';
import { StationDeleteInput } from './dto/delete-station.dto';

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
    return await this.stationService.saveStation(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getStationById(@Param('id') id: string) {
    return await this.stationService.findOneById(id);
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
    @Body() dto: SaveStationDto,
  ) {
    return await this.stationService.updateById(user.id, id, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.stationService.hiddenById(user.id, id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiple(@CurrentUser() user, @Body() dto: StationDeleteInput) {
    return await this.stationService.deleteMultiple(user.id, dto);
  }
}
