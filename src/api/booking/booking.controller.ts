import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { CurrentUser, Roles } from './../../decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto';

@Controller('booking')
@ApiTags('Booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async booking(@Body() dto: CreateBookingDto, @CurrentUser() user) {
    return this.bookingService.booking(dto, user.id);
  }

  @Get('zalopay-payment-url/:orderCode')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getZaloPayPaymentUrl(
    @Param('orderCode') orderCode: string,
    @CurrentUser() user,
  ) {
    return await this.bookingService.getZaloPayPaymentUrl(orderCode, user.id);
  }
}
