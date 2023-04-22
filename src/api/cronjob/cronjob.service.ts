import { OrderStatusEnum, PaymentMethodEnum } from './../../enums';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../order/order.service';
import { CronjobOrderPaymentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './../../database/entities';
import { CheckStatusZaloPayPaymentDto } from '../order/dto';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class CronjobService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private orderService: OrderService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async cronjobOrderPayment(dto: CronjobOrderPaymentDto) {
    try {
      const { secretKey } = dto;
      const secret = this.configService.get('SECRET_KEY_CRONJOB');
      if (secretKey !== secret) {
        throw new BadRequestException('SECRET_KEY_IS_NOT_VALID');
      }

      const orderCodes = await this.orderRepository.find({
        where: {
          status: OrderStatusEnum.UNPAID,
          transId: Not(IsNull()),
          createAppTime: Not(IsNull()),
        },
        select: {
          code: true,
        },
      });
      const userId = await this.configService.get('ADMIN_ID');
      const cronjob = await orderCodes.map(async (item) => {
        const { code } = item;
        const dto = new CheckStatusZaloPayPaymentDto();
        dto.orderCode = code;
        dto.paymentMethod = PaymentMethodEnum.ZALOPAY;
        const order = await this.orderService.checkStatusZaloPay(dto, userId);
        return order;
      });
      await Promise.all(cronjob);
    } catch (error) {
      console.log(error);
    }
  }
}
