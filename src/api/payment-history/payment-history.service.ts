import {
  OrderStatusEnum,
  PaymentHistoryStatusEnum,
  PaymentMethodEnum,
  SortEnum,
  UserStatusEnum,
} from './../../enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './dto';
import { Order, PaymentHistory } from './../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentHistory)
    private readonly paymentHRepository: Repository<PaymentHistory>,
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  private async findOneOrder(options: any) {
    return await this.orderRepository.findOne({
      where: { ...options?.where },
      select: {
        // orderDetails: {
        //   id: true,
        //   total: true,
        //   note: true,
        //   orderCode: true,
        //   // ticketDetail: {
        //   //   id: true,
        //   //   code: true,
        //   //   status: true,
        //   //   note: true,
        //   //   seat: {
        //   //     id: true,
        //   //     code: true,
        //   //     name: true,
        //   //     vehicle: {
        //   //       id: true,
        //   //       code: true,
        //   //       name: true,
        //   //       licensePlate: true,
        //   //       totalSeat: true,
        //   //       status: true,
        //   //     },
        //   //   },
        //   //   ticket: {
        //   //     id: true,
        //   //     code: true,
        //   //     startDate: true,
        //   //     endDate: true,
        //   //     tripDetail: {
        //   //       id: true,
        //   //       code: true,
        //   //       departureTime: true,
        //   //       expectedTime: true,
        //   //       trip: {
        //   //         id: true,
        //   //         code: true,
        //   //         name: true,
        //   //         status: true,
        //   //         fromStation: {
        //   //           id: true,
        //   //           code: true,
        //   //           name: true,
        //   //           fullAddress: true,
        //   //         },
        //   //         toStation: {
        //   //           id: true,
        //   //           code: true,
        //   //           name: true,
        //   //           fullAddress: true,
        //   //         },
        //   //       },
        //   //     },
        //   //   },
        //   // },
        // },
        // staff: {
        //   id: true,
        //   isActive: true,
        //   phone: true,
        //   email: true,
        //   fullName: true,
        //   gender: true,
        //   birthDay: true,
        // },
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
        // promotionHistories: {
        //   id: true,
        //   code: true,
        //   amount: true,
        //   note: true,
        //   quantity: true,
        //   type: true,
        //   promotionLineCode: true,
        //   orderCode: true,
        // },
        ...options?.select,
      },
      relations: {
        // orderDetails: {
        //   ticketDetail: {
        //     seat: {
        //       vehicle: true,
        //     },
        //     ticket: {
        //       tripDetail: {
        //         trip: {
        //           fromStation: true,
        //           toStation: true,
        //         },
        //       },
        //     },
        //   },
        // },
        // staff: true,
        customer: true,
        // promotionHistories: true,
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
    if (!code) {
      throw new BadRequestException('ORDER_CODE_IS_REQUIRED');
    }
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneOrder(options);
  }

  private async getOrderByCode(code: string, options?: any) {
    const order = await this.findOneOrderByCode(code, options);
    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }
    return order;
  }

  private async findOnePaymentHistory(options: any) {
    return await this.paymentHRepository.findOne({
      where: { ...options?.where },
      select: {
        ...options?.select,
      },
      relations: {
        ...options?.relations,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options?.other,
    });
  }

  async findOnePaymentHistoryByCode(code: string, options?: any) {
    if (!code) {
      throw new BadRequestException('PAYMENT_HISTORY_CODE_IS_REQUIRED');
    }
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOnePaymentHistory(options);
  }

  async getPaymentHistoryByCode(code: string, options?: any) {
    const paymentHistory = await this.findOnePaymentHistoryByCode(
      code,
      options,
    );
    if (!paymentHistory) {
      throw new BadRequestException('PAYMENT_HISTORY_NOT_FOUND');
    }
    return paymentHistory;
  }

  async createPaymentHistory(dto: CreatePaymentHistoryDto, userId: string) {
    if (!userId) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const customer = await this.customerService.findOneById(userId);
    const admin = await this.adminService.findOneById(userId);

    if (!customer && !admin) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    if (
      (customer && customer.status === UserStatusEnum.INACTIVATE) ||
      (admin && !admin.isActive)
    ) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const {
      note,
      amount,
      orderCode,
      paymentMethod,
      transId,
      createAppTime,
      status,
    } = dto;
    const paymentHistory = new PaymentHistory();
    if (note) {
      paymentHistory.note = note;
    }
    if (!orderCode) {
      throw new BadRequestException('ORDER_CODE_IS_REQUIRED');
    }
    const orderExist = await this.getOrderByCode(orderCode);
    if (customer.id !== orderExist.customer.id) {
      throw new BadRequestException('ORDER_NOT_BELONG_TO_USER');
    }
    delete orderExist.customer;

    paymentHistory.code = transId;
    paymentHistory.orderCode = orderCode;
    switch (status) {
      case PaymentHistoryStatusEnum.SUCCESS:
      case PaymentHistoryStatusEnum.FAILED:
      case PaymentHistoryStatusEnum.ZALOPAY_PENDING:
        paymentHistory.status = status;
        break;
      default:
        paymentHistory.status = PaymentHistoryStatusEnum.ZALOPAY_PENDING;
        break;
    }
    if (!amount) {
      throw new BadRequestException('AMOUNT_IS_REQUIRED');
    }
    if (amount < 0) {
      throw new BadRequestException(
        'AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    paymentHistory.amount = amount;

    if (!paymentMethod) {
      throw new BadRequestException('PAYMENT_METHOD_IS_REQUIRED');
    }
    switch (paymentMethod) {
      case PaymentMethodEnum.CASH:
      case PaymentMethodEnum.ZALOPAY:
        paymentHistory.paymentMethod = paymentMethod;
        break;
      default:
        throw new BadRequestException('PAYMENT_METHOD_IS_ENUM');
        break;
    }

    if (!transId) {
      throw new BadRequestException('');
    }
    paymentHistory.transId = transId;

    if (!createAppTime) {
      throw new BadRequestException('CREATE_APP_TIME_IS_REQUIRED');
    }
    paymentHistory.createAppTime = new Date(createAppTime);

    paymentHistory.order = orderExist;
    const paymentHistoryCreated = await this.paymentHRepository.save(
      paymentHistory,
    );
    return paymentHistoryCreated;
  }

  async updatePaymentHistoryByCode(code: string, dto: UpdatePaymentHistoryDto) {
    const paymentHistory = await this.getPaymentHistoryByCode(code);
    const order = await this.getOrderByCode(paymentHistory.orderCode);
    if (order.status === OrderStatusEnum.CANCEL) {
      throw new BadRequestException('ORDER_IS_CANCEL');
    }
    if (order.status === OrderStatusEnum.PAID) {
      throw new BadRequestException('ORDER_IS_PAID');
    }
    if (order.status === OrderStatusEnum.RETURNED) {
      throw new BadRequestException('ORDER_IS_RETURNED');
    }
    if (paymentHistory.status === PaymentHistoryStatusEnum.SUCCESS) {
      throw new BadRequestException('PAYMENT_HISTORY_IS_SUCCESS');
    }
    if (paymentHistory.status === PaymentHistoryStatusEnum.FAILED) {
      throw new BadRequestException('PAYMENT_HISTORY_IS_FAILED');
    }
    const { note, amount, paymentMethod, paymentTime, zaloTransId, status } =
      dto;
    if (note) {
      paymentHistory.note = note;
    }
    if (amount) {
      if (amount < 0) {
        throw new BadRequestException(
          'AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
        );
      }
      paymentHistory.amount = amount;
    }
    switch (paymentMethod) {
      case PaymentMethodEnum.CASH:
      case PaymentMethodEnum.ZALOPAY:
        paymentHistory.paymentMethod = paymentMethod;
        break;
      default:
        break;
    }
    switch (status) {
      case PaymentHistoryStatusEnum.SUCCESS:
      case PaymentHistoryStatusEnum.FAILED:
      case PaymentHistoryStatusEnum.ZALOPAY_PENDING:
        paymentHistory.status = status;
        break;
      default:
        break;
    }
    if (!paymentTime) {
      throw new BadRequestException('PAYMENT_TIME_IS_REQUIRED');
    }
    paymentHistory.paymentTime = paymentTime;
    if (!zaloTransId) {
      throw new BadRequestException('ZALO_TRANS_ID_IS_REQUIRED');
    }
    paymentHistory.zaloTransId = zaloTransId;
    paymentHistory.order = order;

    const paymentHistoryUpdated = await this.paymentHRepository.save(
      paymentHistory,
    );
    return paymentHistoryUpdated;
  }
}
