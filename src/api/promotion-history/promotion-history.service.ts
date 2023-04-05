import { InjectRepository } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  PromotionHistory,
  PromotionLine,
  Staff,
} from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePromotionHistoryDto } from './dto';
import { PromotionHistoryTypeEnum } from './../../enums';

@Injectable()
export class PromotionHistoryService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(PromotionLine)
    private readonly promotionLineRepository: Repository<PromotionLine>,
    @InjectRepository(PromotionHistory)
    private readonly promotionHistoryRepository: Repository<PromotionHistory>,
    private dataSource: DataSource,
  ) {}

  async findOnePromotionHistory(options: any) {
    return await this.promotionHistoryRepository.findOne({
      where: { ...options?.where },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      relations: {
        ...options?.relations,
      },
      order: {
        ...options?.order,
      },
    });
  }

  async findPromotionHistoryById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOnePromotionHistory(options);
  }

  async findPromotionHistoryByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOnePromotionHistory(options);
  }

  async getPromotionHistoryById(id, options?: any) {
    const promotionHistory = await this.findPromotionHistoryById(id, options);
    if (!promotionHistory) {
      throw new BadRequestException('PROMOTION_HISTORY_NOT_FOUND');
    }
    return promotionHistory;
  }

  async getPromotionHistoryByCode(code, options?: any) {
    const promotionHistory = await this.findPromotionHistoryByCode(
      code,
      options,
    );
    if (!promotionHistory) {
      throw new BadRequestException('PROMOTION_HISTORY_NOT_FOUND');
    }
    return promotionHistory;
  }

  async getPromotionHistoryStatusEnum() {
    return {
      dataResult: Object.keys(PromotionHistoryTypeEnum).map(
        (key) => PromotionHistoryTypeEnum[key],
      ),
    };
  }

  async createPromotionHistory(dto: CreatePromotionHistoryDto, userId: string) {
    const { amount, orderCode, promotionLineCode, quantity, type } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const promotionHistory = new PromotionHistory();
    const order = await this.orderRepository.findOne({
      where: { code: orderCode },
      relations: { orderDetails: true },
    });
    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }
    promotionHistory.order = order;

    const promotionLine = await this.promotionLineRepository.findOne({
      where: { code: promotionLineCode },
      relations: { promotionDetail: true },
    });
    if (!promotionLine) {
      throw new BadRequestException('PROMOTION_LINE_NOT_FOUND');
    }
    promotionHistory.promotionLine = promotionLine;

    if (!amount) {
      throw new BadRequestException('AMOUNT_IS_REQUIRED');
    }
    promotionHistory.amount = amount;

    if (!quantity) {
      throw new BadRequestException('QUANTITY_IS_REQUIRED');
    }
    if (!Number.isInteger(quantity)) {
      throw new BadRequestException('QUANTITY_MUST_BE_INTEGER');
    }
    if (quantity <= 0) {
      throw new BadRequestException('QUANTITY_MUST_BE_GREATER_THAN_0');
    }
    promotionHistory.quantity = quantity;

    switch (type) {
      case PromotionHistoryTypeEnum.PRODUCT_DISCOUNT:
      case PromotionHistoryTypeEnum.PRODUCT_DISCOUNT_PERCENT:
      case PromotionHistoryTypeEnum.REFUND:
        promotionHistory.type = type;
        break;
      default:
        break;
    }

    const savedPromotionHistory = await this.promotionHistoryRepository.save(
      promotionHistory,
    );
    delete savedPromotionHistory.deletedAt;
    return savedPromotionHistory;
  }
}
