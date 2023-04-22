import {
  CreateOrderDto,
  FilterBillAvailableDto,
  FilterBillDto,
  FilterBillHistoryDto,
  FilterOrderDto,
  UpdateOrderDto,
  PaymentAdminDto,
  CheckStatusZaloPayPaymentDto,
} from './dto';
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

  @Get('payment-method')
  @HttpCode(HttpStatus.OK)
  async getPaymentMethod() {
    return await this.orderService.getPaymentMethod();
  }

  @Post('payment')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async payment(@Body() dto: PaymentAdminDto, @CurrentUser() user) {
    return this.orderService.paymentForAdmin(dto, user.id);
  }

  @Post('check-payment-status')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async checkPaymentStatus(
    @Body() dto: CheckStatusZaloPayPaymentDto,
    @CurrentUser() user,
  ) {
    return this.orderService.checkStatusZaloPay(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOrder(
    @Query() dto: FilterOrderDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllOrder(dto, user.id, pagination);
  }

  @Get('bill')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllBill(
    @Query() dto: FilterBillDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllBill(dto, user.id, pagination);
  }

  // danh sách vé đã đi
  @Get('/customer/bill/history')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllBillHistoryForCustomer(
    @Query() dto: FilterBillHistoryDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllBillHistoryForCustomer(
      dto,
      user.id,
      pagination,
    );
  }

  @Get('/customer/bill/available')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllBillAvailableForCustomer(
    @Query() dto: FilterBillAvailableDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.orderService.findAllBillAvailableForCustomer(
      dto,
      user.id,
      pagination,
    );
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

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelOrderById(
    @Body() dto: UpdateOrderDto,
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderByIdOrCode(
      dto,
      user.id,
      id,
      undefined,
    );
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelOrderByCode(
    @Body() dto: UpdateOrderDto,
    @Param('code') code: string,
    @CurrentUser() user,
  ) {
    return await this.orderService.updateOrderByIdOrCode(
      dto,
      user.id,
      undefined,
      code,
    );
  }
}
