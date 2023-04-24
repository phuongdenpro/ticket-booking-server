import {
  OrderStatusEnum,
  PaymentMethodEnum,
  SortEnum,
  TicketStatusEnum,
} from './../../enums';
import { Order, OrderDetail, TicketDetail } from './../../database/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class CallbackService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  private async findOneOrder(options: any) {
    return await this.orderRepository.findOne({
      where: { ...options?.where },
      select: {
        orderDetails: {
          id: true,
          total: true,
          note: true,
          orderCode: true,
          ticketDetail: {
            id: true,
            code: true,
            status: true,
            note: true,
          },
        },
        customer: {
          id: true,
          status: true,
          phone: true,
          email: true,
          fullName: true,
        },
        ...options?.select,
      },
      relations: {
        orderDetails: { ticketDetail: true },
        customer: true,
        ...options?.relations,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  private async findOneOrderByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneOrder(options);
  }

  async callbackZaloPayV2(dto) {
    const config = {
      key2: this.configService.get('ZALO_PAY_KEY_2'),
    };
    const result = {};
    try {
      console.log('callback dto', dto + '');
      const { data: dataStr, mac: reqMac } = dto;

      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (mac !== reqMac) {
        // callback không hợp lệ
        result['return_code'] = -1;
        result['return_message'] = 'mac not equal';
        console.log('mac not equal');
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        const dataJson = JSON.parse(dataStr, config.key2);
        console.log('dataJson =', dataJson);
        const { app_trans_id, item, zp_trans_id, server_time } = dataJson;
        const orderCode = item[0].orderCode;
        const orderExist = await this.findOneOrderByCode(orderCode);
        if (orderExist) {
          const dataOrder = {
            transId: app_trans_id + '',
            paymentMethod: PaymentMethodEnum.ZALOPAY,
            status: OrderStatusEnum.PAID,
            zaloTransId: zp_trans_id + '',
            paymentTime: moment.unix(server_time / 1000).toDate(),
            updatedBy: orderExist.customer.id,
            note: 'thanh toán thành công',
          };
          delete orderExist.customer;
          const updateOrder = Object.assign(orderExist, dataOrder);
          // update order
          await this.orderRepository.save(updateOrder);

          const orderDetails: OrderDetail[] = orderExist.orderDetails;
          const ticketDetails = orderDetails.map(async (orderDetail) => {
            const ticketDetail: TicketDetail = orderDetail.ticketDetail;
            const updateTicketDetail = Object.assign(ticketDetail, {
              status: TicketStatusEnum.SOLD,
            });
            await this.dataSource
              .getRepository(TicketDetail)
              .save(updateTicketDetail);
          });
          await Promise.all(ticketDetails);
          result['return_code'] = 1;
          result['return_message'] = 'success';
          console.log('thanh toán thành công');
        } else {
          result['return_code'] = 0;
          result['return_message'] = 'fail';
          console.log('thanh toán thất bại');
        }
        console.log('result =', result);
        return result;
      }
    } catch (error) {
      result['return_code'] = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result['return_message'] = error.message;
      console.log('result =', result);
      return result;
    }
  }
}
