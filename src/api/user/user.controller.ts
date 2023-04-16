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
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ConfirmAccountDto,
  UpdateCustomerDto,
  UserResetPasswordDto,
  UserUpdatePasswordDto,
} from './dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getCustomerStatus() {
    return this.userService.getCustomerStatus();
  }

  @Get('profile')
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@CurrentUser() user) {
    return this.userService.profile(user?.id);
  }

  @Post('active')
  @HttpCode(HttpStatus.OK)
  async confirmAccount(@Body() dto: ConfirmAccountDto) {
    return this.userService.confirmAccount(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: UserResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }

  @Patch('update-info')
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(@CurrentUser() user, @Body() dto: UpdateCustomerDto) {
    return this.userService.updateCustomer(user.id, dto, user.id);
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
