import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../order/order.service';
import { FilterOrderRefundDto, UpdateOrderRefundDto } from './dto';

@Controller('order-refund')
@ApiTags('Order Refund')
export class OrderRefundController {
  constructor(private orderService: OrderService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getOrderRefundStatus() {
    return await this.orderService.getOrderRefundStatus();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOrder(
    @Query() dto: FilterOrderRefundDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllOrderRefund(dto, user.id, pagination);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderByCode(@Param('code') code: string) {
    return await this.orderService.getOrderRefundByCode(code);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateOrderRefundById(
    @Param('id') id: string,
    @Body() dto: UpdateOrderRefundDto,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderRefundByIdOrCode(
      dto,
      user.id,
      undefined,
      id,
    );
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateOrderRefundByCode(
    @Param('code') code: string,
    @Body() dto: UpdateOrderRefundDto,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderRefundByIdOrCode(
      dto,
      user.id,
      code,
    );
  }
}
