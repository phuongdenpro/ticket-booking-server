import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
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
import { RoleEnum } from './../../enums';
import { JwtAuthGuard } from './../../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Patch } from '@nestjs/common/decorators';
import { VehicleService } from './vehicle.service';
import {
  FilterVehicleDto,
  SaveVehicleDto,
  VehicleDeleteMultiInput,
  UpdateVehicleDto,
} from './dto';

@Controller('vehicle')
@ApiTags('Vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewVehicle(@Body() dto: SaveVehicleDto, @CurrentUser() user) {
    return await this.vehicleService.saveVehicle(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getVehicleById(@Param('id') id: string) {
    return await this.vehicleService.findOneVehicleById(id);
  }

  @Get('/vehicle-type')
  @HttpCode(HttpStatus.OK)
  async getVehicleType() {
    return await this.vehicleService.getVehicleTypes();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterVehicleDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.vehicleService.findAllVehicle(dto, pagination);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return await this.vehicleService.updateById(dto, user.id, id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStationById(@CurrentUser() user, @Param('id') id: string) {
    return await this.vehicleService.deleteById(user.id, id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiple(
    @CurrentUser() user,
    @Body() dto: VehicleDeleteMultiInput,
  ) {
    return await this.vehicleService.deleteMultipleVehicle(user.id, dto);
  }
}
