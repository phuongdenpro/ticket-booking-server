import { OrderService } from './order.service';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('order-detail')
@ApiTags('Order Detail')
export class OrderDetailController {
  constructor(private orderService: OrderService) {}

  // order detail
  // @Post('')
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
