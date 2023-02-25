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
import { UserLoginDto, UserRegisterDto, UserRefreshTokenDto } from './dto';
import { AuthUserService } from './user.service';

@Controller('auth/user')
@ApiTags('Auth')
export class AuthUserController {
  constructor(private userService: AuthUserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: UserRegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginDto) {
    return this.userService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user) {
    return this.userService.logout(user.id);
  }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // async profile(@CurrentUser() user) {
  //   return this.userService.profile(user?.['id']);
  // }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() dto: UserRefreshTokenDto) {
    return this.userService.refreshTokens(dto.refreshToken);
  }

  // @Patch('password')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // async updatePassword(
  //   @CurrentUser() user,
  // ) {
  //   return this.userService.updatePassword(user.id, dto);
  // }
}
