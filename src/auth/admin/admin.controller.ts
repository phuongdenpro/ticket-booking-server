import { CurrentUser } from 'src/decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '../guards';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from './dto';

@Controller('auth/admin')
@ApiTags('Auth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async register(@CurrentUser() user, @Body() dto: AdminRegisterDto) {
    return this.adminService.register(user?.['id'], dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async profile(@CurrentUser() user) {
    return this.adminService.profile(user?.['id']);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user) {
    console.log(user);
    return this.adminService.logout(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@CurrentUser() user) {
    return this.adminService.refreshTokens(user.id);
  }
}
