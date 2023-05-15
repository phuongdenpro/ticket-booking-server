import { JwtAuthGuard } from './../../auth/guards';
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
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { RoleEnum } from './../../enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStaffDto, FilterAllStaffDto, UpdateStaffDto } from './dto';

@Controller('staff')
@ApiTags('Staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get('admin-roles')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAdminRoles(
    @CurrentUser() user,
  ) {
    return await this.staffService.getAdminRoles(user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterAllStaffDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.staffService.findAllStaff(dto, user.id, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewStaff(@Body() dto: CreateStaffDto, @CurrentUser() user) {
    return await this.staffService.createStaff(dto, user.id);
  }

  @Get('code/:code')
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getStaffByCode(@Param('code') code: string, @CurrentUser() user) {
    return await this.staffService.getStaffForAdminByCode(code, user.id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStaffByCode(
    @Param('code') code: string,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user,
  ) {
    return await this.staffService.updateStaff(dto, user.id, code);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteStaffByCode(@Param('code') code: string, @CurrentUser() user) {
    return await this.staffService.deleteStaffByCode(code, user.id);
  }
}
