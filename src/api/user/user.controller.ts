import { JwtAuthGuard } from './../../auth/guards';
import { Roles, CurrentUser } from './../../decorator';
import { RoleEnum } from './../../enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdatePasswordDto } from './dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@CurrentUser() user) {
    return this.userService.profile(user?.['id']);
  }

  @Patch('password')
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePassword(
    @CurrentUser() user,
    @Body() dto: UserUpdatePasswordDto,
  ) {
    return this.userService.updatePassword(user.id, dto);
  }
}
