import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { CurrentUser, Roles } from './../../decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
}
