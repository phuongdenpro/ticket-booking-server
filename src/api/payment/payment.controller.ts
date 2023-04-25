import { CurrentUser, Roles } from './../../decorator';
import { PaymentService } from './payment.service';
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
import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from 'src/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckStatusZaloPayPaymentDto } from './dto';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('zalopay/:orderCode/url')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getZaloPayPaymentUrl(
    @Param('orderCode') orderCode: string,
    @CurrentUser() user,
  ) {
    return await this.paymentService.getZaloPayPaymentUrl(orderCode, user.id);
  }

  @Post('zalopay/check-status')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async checkPaymentStatus(
    @Body() dto: CheckStatusZaloPayPaymentDto,
    @CurrentUser() user,
  ) {
    return await this.paymentService.checkStatusZaloPay(dto, user.id);
  }
}
