import { CreateOrderDto, FilterOrderDto } from './dto';
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
  async getOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getOrderByCode(@Param('code') code: string) {
    return await this.orderService.getOrderByCode(code);
  }
}
