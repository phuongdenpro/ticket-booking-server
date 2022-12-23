import { CurrentUser, GetPagination, Pagination,Roles } from 'src/decorator';
// import { Roles } from 'src/decorator/roles.decorator';
import { AdminUser } from 'src/database/entities';
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
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: FilterUserDto, @GetPagination() pagination?: Pagination) {
    return this.userService.findAll(dto, pagination);
  }

  @Patch(':id/password')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(LoggingInterceptor)
  async updatePassword(
    @CurrentUser() admin: AdminUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto
  ) {
    return this.userService.updatePassword(admin.id, id, dto);
  }


  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async create(@CurrentUser() admin: AdminUser, @Body() dto: CreateUserDto) {
    return this.userService.create(admin.id, dto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() admin: AdminUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.update(admin.id, id, dto);
  }
}
