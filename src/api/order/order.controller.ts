import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { OrderService } from './order.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // order
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user) {
    return await this.orderService.createOrder(dto, user.id);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getOrderStatus() {
    return await this.orderService.getOrderStatus();
  }

  @Get('update-status')
  @HttpCode(HttpStatus.OK)
  async getOrderUpdateStatus() {
    return await this.orderService.getOrderUpdateStatus();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPriceList(
    @Query() dto: FilterOrderDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllOrder(dto, user.id, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderByCode(@Param('code') code: string) {
    return await this.orderService.getOrderByCode(code);
  }

  @Patch('customer/id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelOrderById(
    @Body() dto: UpdateOrderDto,
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderByIdOrCodeForCustomer(
      dto,
      user.id,
      id,
      undefined,
    );
  }

  @Patch('customer/code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelOrderByCode(
    @Body() dto: UpdateOrderDto,
    @Param('code') code: string,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderByIdOrCodeForCustomer(
      dto,
      user.id,
      undefined,
      code,
    );
  }
}
