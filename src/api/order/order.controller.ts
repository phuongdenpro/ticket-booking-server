import { CreateOrderDetailDto, CreateOrderDto } from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { CurrentUser, Roles } from './../../decorator';
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

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // order
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user) {
  //   return await this.orderService.createOrder(dto, user.id);
  // }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getOrderByCode(@Param('code') code: string) {
    return await this.orderService.getOrderByCode(code);
  }

  // order detail
  // @Post('order-detail')
  // @HttpCode(HttpStatus.CREATED)
  // @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async createOrderDetail(
  //   @Body() dto: CreateOrderDetailDto,
  //   @CurrentUser() user,
  // ) {
  //   return await this.orderService.createOrderDetail(dto, user.id);
  // }

  @Get('order-detail/id/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderDetailById(@Param('id') id: string) {
    return await this.orderService.getOrderDetailById(id);
  }

  @Get('order-detail/code/:code')
  @HttpCode(HttpStatus.OK)
  async getOrderDetailByCode(@Param('code') code: string) {
    return await this.orderService.getOrderDetailByCode(code);
  }
}
