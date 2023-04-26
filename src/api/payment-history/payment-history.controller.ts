import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentHistoryService } from './payment-history.service';
import { Roles } from './../../decorator';
import { RoleEnum } from './../../enums';
import { JwtAuthGuard } from './../../auth/guards';

@Controller('payment-history')
@ApiTags('Payment History')
export class PaymentHistoryController {
  constructor(private paymentHistoryService: PaymentHistoryService) {}

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPaymentHistoryByCode(@Param('code') code: string) {
    return await this.paymentHistoryService.getPaymentHistoryByCode(code);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPaymentHistoryById(@Param('id') id: string) {
    return await this.paymentHistoryService.getPaymentHistoryById(id);
  }

  @Get('order-code/:orderCode')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPaymentHistoryByOrderCode(@Param('orderCode') orderCode: string) {
    return await this.paymentHistoryService.getPaymentHistoryByOrderCode(
      orderCode,
    );
  }
}
