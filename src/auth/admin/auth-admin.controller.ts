import { CurrentUser } from '../../decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { AuthAdminService } from './auth-admin.service';
import { AdminLoginDto, AdminRegisterDto, AdminRefreshTokenDto } from './dto';
import { SendOtpDto } from '../customer/dto';

@Controller('auth/admin')
@ApiTags('Auth Admin')
export class AuthAdminController {
  constructor(private adminService: AuthAdminService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async register(@CurrentUser() user, @Body() dto: AdminRegisterDto) {
    return this.adminService.register(user?.['id'], dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(@CurrentUser() user) {
    return this.adminService.logout(user.id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: AdminRefreshTokenDto) {
    return this.adminService.refreshToken(dto.refreshToken);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.adminService.sendOtp(dto);
  }
}
