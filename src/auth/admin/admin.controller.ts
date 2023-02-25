import { AdminRefreshTokenDto } from './dto/admin-refresh-token.dto';
import { CurrentUser } from './../../decorator';
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
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from './dto';

@Controller('auth/admin')
@ApiTags('Auth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async register(@CurrentUser() user, @Body() dto: AdminRegisterDto) {
    return this.adminService.register(user?.['id'], dto);
  }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // async profile(@CurrentUser() user) {
  //   return this.adminService.profile(user?.['id']);
  // }

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
}
