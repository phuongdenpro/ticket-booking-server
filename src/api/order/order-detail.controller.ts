import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { Roles } from './../../decorator';
import { OrderService } from './order.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order-detail')
@ApiTags('Order Detail')
export class OrderDetailController {
  constructor(private orderService: OrderService) {}

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderDetailById(@Param('id') id: string) {
    return await this.orderService.getOrderDetailById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderDetailByCode(@Param('code') code: string) {
    return await this.orderService.getOrderDetailByCode(code);
  }

  @Get('order-code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderDetailsByOrderCode(@Param('code') code: string) {
    return await this.orderService.getOrderDetailByOrderCode(code);
  }
}
