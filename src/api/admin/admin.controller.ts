import { RoleEnum } from './../../enums/roles.enum';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CurrentUser, Roles } from './../../decorator';
import { JwtAuthGuard } from './../../auth/guards';
import {
  AdminResetPasswordDto,
  AdminUpdateDto,
  AdminUpdatePasswordDto,
  ConfirmAccountAdminDto,
} from './dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('profile')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@CurrentUser() user) {
    return this.adminService.profile(user?.id);
  }

  @Patch('update-profile')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@Body() dto: AdminUpdateDto, @CurrentUser() user) {
    return this.adminService.updateProfile(dto, user?.id);
  }

  @Patch('password')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePassword(
    @CurrentUser() user,
    @Body() dto: AdminUpdatePasswordDto,
  ) {
    return this.adminService.updatePassword(user?.id, dto);
  }

  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  async updateResetPassword(@Body() dto: AdminResetPasswordDto) {
    return this.adminService.resetPassword(dto);
  }

  @Post('active')
  @HttpCode(HttpStatus.OK)
  async confirmAccount(@Body() dto: ConfirmAccountAdminDto) {
    return this.adminService.confirmAccount(dto);
  }
}
