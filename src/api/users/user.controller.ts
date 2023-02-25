import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { Staff } from './../../database/entities';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';

import {
  CountUserDto,
  CreateUserDto,
  FilterUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';
import { UsersService } from './user.service';

@Controller('user')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterUserDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.userService.findAll(dto, pagination);
  }

  @Get(':id')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }
}
