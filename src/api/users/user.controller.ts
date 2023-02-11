import { CurrentUser, GetPagination, Pagination } from 'src/decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { Staff } from 'src/database/entities';
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
import { JwtAuthGuard } from 'src/auth/guards';
// import { LoggingInterceptor } from '@src/libs/utils/filter/logging.filter';
import { RoleEnum } from 'src/enums';

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
