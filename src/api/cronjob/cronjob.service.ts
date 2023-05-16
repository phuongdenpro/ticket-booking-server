import { CheckStatusZaloPayPaymentDto } from './../payment/dto';
import { OrderStatusEnum, PaymentMethodEnum } from './../../enums';
import { DataSource, Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronjobOrderPaymentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, PaymentHistory } from './../../database/entities';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class CronjobService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private paymentService: PaymentService,
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

      const orderCodes = await this.orderRepository
        .createQueryBuilder('q')
        .where('q.status = :status', { status: OrderStatusEnum.UNPAID })
        .select(['q.code'])
        .getMany();

      if (orderCodes.length <= 0) {
        console.log('No order need to cronjob');
      } else {
        const userId = await this.configService.get('ADMIN_ID');
        const cronjob = await orderCodes.map(async (item) => {
          const { code, paymentMethod } = item;
          const dto = new CheckStatusZaloPayPaymentDto();
          dto.orderCode = code;
          switch (paymentMethod) {
            case PaymentMethodEnum.ZALOPAY:
              dto.paymentMethod = PaymentMethodEnum.ZALOPAY;
              break;
            default:
              dto.paymentMethod = undefined;
              break;
          }
          const order = await this.paymentService.checkStatusZaloPay(
            dto,
            userId,
          );
          return order;
        });
        await Promise.all(cronjob);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
