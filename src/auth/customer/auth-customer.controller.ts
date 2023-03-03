import { CustomerRegisterDto } from './dto/create-customer.dto';
import { CurrentUser } from '../../decorator';
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
import { JwtAuthGuard } from '../guards';
import { CustomerLoginDto, CustomerRefreshTokenDto } from './dto';
import { AuthCustomerService } from './auth-customer.service';
import { Roles } from '../../decorator/roles.decorator';
import { RoleEnum } from '../../enums/roles.enum';
import { CustomerUpdatePasswordDto } from './dto/customer-update-password.dto';


@Controller('auth/user')
@ApiTags('Auth')
export class AuthCustomerController {
  constructor(private userService: AuthCustomerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CustomerRegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: CustomerLoginDto) {
    return this.userService.login(dto);
  }

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
  async updatePassword(@CurrentUser() user, @Body() dto: CustomerUpdatePasswordDto) {
    return this.userService.updatePassword(user.id, dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user) {
    return this.userService.logout(user.id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() dto: CustomerRefreshTokenDto) {
    return this.userService.refreshTokens(dto.refreshToken);
  }
}
