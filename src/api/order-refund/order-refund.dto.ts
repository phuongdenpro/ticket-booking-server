import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../order/order.service';

@Controller('order-refund')
@ApiTags('Order Refund')
export class OrderRefundController {
  constructor(private orderService: OrderService) {}
}
