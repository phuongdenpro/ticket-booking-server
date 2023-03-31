import { CreateOrderDetailDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards';
import { RoleEnum } from '../../enums';
import { CurrentUser, Roles } from '../../decorator';
import { OrderService } from './order.service';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order-detail')
@ApiTags('Order Detail')
export class OrderDetailController {
  constructor(private orderService: OrderService) {}

  // order detail
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createOrderDetail(
    @Body() dto: CreateOrderDetailDto,
    @CurrentUser() user,
  ) {
    return await this.orderService.createOrderDetail(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderDetailById(@Param('id') id: string) {
    return await this.orderService.getOrderDetailById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getOrderDetailByCode(@Param('code') code: string) {
    return await this.orderService.getOrderDetailByCode(code);
  }
}
