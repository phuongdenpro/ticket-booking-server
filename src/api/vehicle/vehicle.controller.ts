import { CurrentUser, GetPagination, Pagination, Roles } from 'src/decorator';
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
import { Patch } from '@nestjs/common/decorators';
import { VehicleService } from './vehicle.service';
import { FilterVehicleDto, HiddenVehicleDto, SaveVehicleDto } from './dto';

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
    return await this.vehicleService.findAll(dto, pagination);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: SaveVehicleDto,
  ) {
    return await this.vehicleService.updateById(dto, user.id, id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async hiddenStationById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: HiddenVehicleDto,
  ) {
    return await this.vehicleService.hiddenById(dto, user.id, id);
  }
}
