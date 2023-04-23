import { MomoPaymentTypeEnum } from './../../enums';
import {
  Staff,
  Order,
  OrderDetail,
  TicketDetail,
  Customer,
} from './../../database/entities';
import { CheckStatusZaloPayPaymentDto } from '../order/dto';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  SortEnum,
  TicketStatusEnum,
  UserStatusEnum,
} from './../../enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import * as qs from 'qs';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private dataSource: DataSource,
    private configService: ConfigService,
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
          gender: true,
          address: true,
          fullAddress: true,
          note: true,
          birthday: true,
        },
        ...options?.select,
      },
      relations: {
        orderDetails: { ticketDetail: true },
        staff: true,
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

  async getZaloPayPaymentUrl(orderCode: string, userId: string) {
    if (!userId) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const customer: Customer = await this.customerService.findOneById(userId);
    if (!customer) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (customer.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    let paymentResult;
    try {
      const orderExist = await this.findOneOrderByCode(orderCode);
      if (!orderExist) {
        throw new BadRequestException('ORDER_NOT_FOUND');
      }
      switch (orderExist.status) {
        case OrderStatusEnum.PAID:
          throw new BadRequestException('ORDER_ALREADY_PAID');
          break;
        case OrderStatusEnum.CANCEL:
          throw new BadRequestException('ORDER_ALREADY_CANCEL');
          break;
        case OrderStatusEnum.RETURNED:
          throw new BadRequestException('ORDER_ALREADY_RETURNED');
          break;
        default:
          break;
      }
      const config = {
        app_id: Number(this.configService.get('ZALO_PAY_APP_ID')),
        key1: this.configService.get('ZALO_PAY_KEY_1'),
        key2: this.configService.get('ZALO_PAY_KEY_2'),
        endpoint: this.configService.get('ZALO_PAY_ENDPOINT'),
      };
      const embed_data = {
        redirecturl: this.configService.get('REDIRECT_URL'),
      };
      const randomCode = Math.floor(Math.random() * 1000000);
      const transID = `${moment().format('YYMMDD')}_${orderCode}-${randomCode}`;
      const items = [
        {
          orderCode,
          transID,
        },
      ];
      const payload = {
        app_id: config.app_id,
        app_trans_id: transID,
        app_user: 'user123',
        app_time: Date.now(), // milliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: Number(orderExist.finalTotal),
        description: `Thanh toan ve #${orderCode}`,
        bank_code: 'CC',
        title: 'thanh toan ve #' + orderCode,
        callback_url: this.configService.get('CALLBACK_URL'),
      };
      const data =
        config.app_id +
        '|' +
        payload.app_trans_id +
        '|' +
        payload.app_user +
        '|' +
        payload.amount +
        '|' +
        payload.app_time +
        '|' +
        payload.embed_data +
        '|' +
        payload.item;
      payload['mac'] = CryptoJS.HmacSHA256(data, config.key1).toString();
      await axios
        .post(config.endpoint, null, { params: payload })
        .then((result) => {
          paymentResult = {
            zalo: result.data,
            appTransId: payload.app_trans_id,
            appTime: payload.app_time,
          };
        })
        .catch((err) => console.log(err));
      orderExist.transId = payload.app_trans_id;
      orderExist.createAppTime = payload.app_time + '';
      orderExist.paymentMethod = PaymentMethodEnum.ZALOPAY;
      orderExist.updatedBy = userId;
      await this.orderRepository.save(orderExist);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    if (!paymentResult) {
      throw new BadRequestException('CONNECT_ZALOPAY_FAIL');
    }
    return paymentResult;
  }

  async checkStatusZaloPay(dto: CheckStatusZaloPayPaymentDto, userId: string) {
    let saveOrder: Order;
    try {
      if (!userId) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      const staff: Staff = await this.adminService.findOneById(userId);
      if (!staff) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!staff.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }
      const { orderCode, paymentMethod } = dto;
      if (!orderCode) {
        throw new BadRequestException('ORDER_CODE_REQUIRED');
      }

      const orderExist = await this.findOneOrderByCode(orderCode);
      if (!orderExist) {
        throw new BadRequestException('ORDER_NOT_FOUND');
      }
      switch (orderExist.status) {
        case OrderStatusEnum.PAID:
          throw new BadRequestException('ORDER_ALREADY_PAID');
        case OrderStatusEnum.CANCEL:
          throw new BadRequestException('ORDER_ALREADY_CANCEL');
        case OrderStatusEnum.RETURNED:
          throw new BadRequestException('ORDER_ALREADY_RETURNED');
        default:
          break;
      }
      orderExist.status = OrderStatusEnum.PAID;
      if (paymentMethod !== PaymentMethodEnum.ZALOPAY) {
        throw new BadRequestException('PAYMENT_METHOD_NOT_FOUND');
      }
      orderExist.paymentMethod = paymentMethod;
      if (!orderExist.transId || !orderExist.createAppTime) {
        throw new BadRequestException('TRANSACTION_ID_REQUIRED');
      }
      const config = {
        app_id: this.configService.get('ZALO_PAY_APP_ID'),
        key1: this.configService.get('ZALO_PAY_KEY_1'),
        key2: this.configService.get('ZALO_PAY_KEY_2'),
        endpoint: this.configService.get('ZALO_PAY_ENDPOINT_QUERY'),
      };
      const postData = {
        app_id: config.app_id,
        app_trans_id: orderExist.transId,
      };
      const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
      postData['mac'] = CryptoJS.HmacSHA256(data, config.key1).toString();

      const postConfig = {
        method: 'post',
        url: config.endpoint,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
      };
      let flag = 0;
      const logData = {
        orderCode,
        paymentMethod,
        transId: orderExist.transId,
        createAppTime: orderExist.createAppTime,
      };
      console.log('check payment: ', logData);

      await axios(postConfig).then(async function (response) {
        if (response.data.return_code === 1) {
          orderExist.updatedBy = userId;
          orderExist.zaloTransId = response.data.zp_trans_id;
          const paymentTime = moment
            .unix(response.data.server_time / 1000)
            .toDate();
          orderExist.paymentTime = paymentTime;
          flag = 1;
        } else if (
          Date.now() > Number(orderExist.createAppTime) + 15 * 60 * 1000 ||
          response.data.return_code == 2
        ) {
          orderExist.updatedBy = userId;
          orderExist.createAppTime = '';
          orderExist.transId = '';
          orderExist.note = 'Giao dịch thất bại';
          flag = 0;
          throw new BadRequestException('PAYMENT_FAIL');
        } else if (response.data.return_code == 3) {
          orderExist.updatedBy = userId;
          orderExist.createAppTime = '';
          orderExist.transId = '';
          orderExist.note = 'Giao dịch chưa được thực hiện';
          flag = 2;
        }
      });
      if (flag === 0) {
        throw new BadRequestException('PAYMENT_FAIL');
      } else if (flag === 2) {
        throw new BadRequestException('PAYMENT_NOT_COMPLETE');
      }
      const orderDetails: OrderDetail[] = orderExist.orderDetails;
      const ticketDetails = orderDetails.map(async (orderDetail) => {
        let ticketDetail: TicketDetail = orderDetail.ticketDetail;
        ticketDetail.status = TicketStatusEnum.SOLD;
        ticketDetail = await this.dataSource
          .getRepository(TicketDetail)
          .save(ticketDetail);
        delete ticketDetail.deletedAt;
        return ticketDetail;
      });
      await Promise.all(ticketDetails);
      saveOrder = await this.orderRepository.save(orderExist);
      saveOrder = await this.findOneOrderByCode(orderCode);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return saveOrder;
  }

  async getMoMoPaymentUrl(orderCode: string, userId: string) {
    if (!userId) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const customer = await this.customerService.findOneById(userId);
    if (!customer) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (customer.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    let paymentResult;
    try {
      const orderExist = await this.findOneOrderByCode(orderCode);
      if (!orderExist) {
        throw new BadRequestException('ORDER_NOT_FOUND');
      }
      switch (orderExist.status) {
        case OrderStatusEnum.PAID:
          throw new BadRequestException('ORDER_ALREADY_PAID');
          break;
        case OrderStatusEnum.CANCEL:
          throw new BadRequestException('ORDER_ALREADY_CANCEL');
          break;
        case OrderStatusEnum.RETURNED:
          throw new BadRequestException('ORDER_ALREADY_RETURNED');
          break;
        default:
          break;
      }
      const config = {
        partnerCode: this.configService.get('MOMO_PARTNER_CODE'),
        partnerName: this.configService.get('MOMO_PARTNER_NAME'),
        storeId: this.configService.get('MOMO_STORE_ID'),
        redirectUrl: this.configService.get('REDIRECT_URL'),
        key1: this.configService.get('MOMO_KEY_1'),
        endpoint: this.configService.get('MOMO_ENDPOINT'),
      };
      const randomCode = Math.floor(Math.random() * 1000000);
      const transID = `${moment().format('YYMMDD')}_${orderCode}-${randomCode}`;
      const payload = {
        partnerCode: config.partnerCode,
        partnerName: config.partnerName,
        storeId: config.storeId,
        requestId: transID,
        amount: orderExist.finalTotal,
        orderId: orderCode,
        orderInfo: `Thanh toán Vé #${orderCode}`,
        redirectUrl: config.redirectUrl,
        ipnUrl: config.redirectUrl,
        requestType: MomoPaymentTypeEnum.ATM,
        extraData: {
          orderCode,
        },
        lang: 'vi',
        signature: '',
      };
      const data =
        'accessKey=' +
        '&amount=' +
        payload.amount +
        '&extraData=' +
        payload.extraData +
        '&ipnUrl=' +
        payload.ipnUrl +
        '&orderId=' +
        payload.orderId +
        '&orderInfo=' +
        payload.orderInfo +
        '&partnerCode=' +
        payload.partnerCode +
        '&redirectUrl=' +
        payload.redirectUrl +
        '&requestId=' +
        payload.requestId +
        '&requestType=' +
        payload.requestType;
      payload.signature = CryptoJS.HmacSHA256(data, config.key1).toString();
      await axios
        .post(config.endpoint, null, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          params: payload,
        })
        .then((result) => {
          console.log('result.data', result.data);
          paymentResult = {
            ...result.data,
          };
        })
        .catch((err) => console.log(err));
      orderExist.paymentMethod = PaymentMethodEnum.MOMO;
      orderExist.updatedBy = userId;
      await this.orderRepository.save(orderExist);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    if (!paymentResult) {
      throw new BadRequestException('CONNECT_ZALOPAY_FAIL');
    }
    return paymentResult;
  }
}
