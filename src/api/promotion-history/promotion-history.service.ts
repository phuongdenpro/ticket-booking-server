import { InjectRepository } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  PromotionDetail,
  PromotionHistory,
  PromotionLine,
  Staff,
  Customer,
} from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePromotionHistoryDto } from './dto';
import {
  PromotionHistoryTypeEnum,
  PromotionLineNoteStatusEnum,
  UserStatusEnum,
} from './../../enums';

@Injectable()
export class PromotionHistoryService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
    const { orderCode, promotionLineCode, type } = dto;
    const queryRunnerPH =
      this.promotionHistoryRepository.manager.connection.createQueryRunner();
    await queryRunnerPH.connect();
    await queryRunnerPH.startTransaction();

    const queryRunnerPL =
      this.promotionLineRepository.manager.connection.createQueryRunner();
    await queryRunnerPL.connect();
    await queryRunnerPL.startTransaction();
    try {
      const customerCreator = await this.dataSource
        .getRepository(Customer)
        .findOne({ where: { id: userId } });
      const admin = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!userId) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (
        (customerCreator &&
          customerCreator.status === UserStatusEnum.INACTIVATE) ||
        (admin && !admin.isActive)
      ) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }

      const promotionHistory = new PromotionHistory();
      const orderExist = await this.orderRepository.findOne({
        where: { code: orderCode },
        relations: { orderDetails: true },
      });
      if (!orderExist) {
        throw new BadRequestException('ORDER_NOT_FOUND');
      }
      promotionHistory.order = orderExist;
      promotionHistory.orderCode = orderExist.code;

      const promotionLine = await this.promotionLineRepository.findOne({
        where: { code: promotionLineCode },
        relations: { promotionDetail: true },
      });
      if (!promotionLine) {
        throw new BadRequestException('PROMOTION_LINE_NOT_FOUND');
      }
      promotionHistory.promotionLine = promotionLine;

      const promotionDetail: PromotionDetail = promotionLine.promotionDetail;
      const orderDetails: OrderDetail[] = orderExist.orderDetails;
      if (
        type === PromotionHistoryTypeEnum.PRODUCT_DISCOUNT ||
        type === PromotionHistoryTypeEnum.PRODUCT_DISCOUNT_PERCENT
      ) {
        if (promotionDetail.quantityBuy > 0) {
          const numOfTicket = orderDetails.length;
          if (numOfTicket < promotionDetail.quantityBuy) {
            throw new BadRequestException('NUMBER_OF_TICKET_IS_NOT_ENOUGH');
          }
          promotionHistory.quantity = Math.floor(
            numOfTicket / promotionDetail.quantityBuy,
          );
        }
        if (promotionDetail.purchaseAmount > 0) {
          if (orderExist.total < promotionDetail.purchaseAmount) {
            throw new BadRequestException('TOTAL_AMOUNT_IS_NOT_ENOUGH');
          }
          promotionHistory.quantity = Math.floor(
            orderExist.total / promotionDetail.purchaseAmount,
          );
        }
        const remainingBudget =
          promotionLine.maxBudget - promotionLine.useBudget;
        if (remainingBudget <= 0) {
          promotionLine.note = PromotionLineNoteStatusEnum.OUT_OF_BUDGET;
          await queryRunnerPL.manager.save(promotionLine);
          throw new BadRequestException('PROMOTION_HAS_OUT_OF_BUDGET');
        }

        let promoAmount = 0;
        if (type === PromotionHistoryTypeEnum.PRODUCT_DISCOUNT) {
          promoAmount =
            promotionDetail.reductionAmount * promotionHistory.quantity;
        } else {
          promoAmount =
            orderExist.total *
            ((promotionDetail.percentDiscount / 100) *
              promotionHistory.quantity);
        }
        if (promoAmount >= promotionDetail.maxReductionAmount) {
          if (promotionDetail.maxReductionAmount >= remainingBudget) {
            promotionHistory.amount = remainingBudget * -1;
            promotionLine.useBudget += remainingBudget;
          } else {
            promotionHistory.amount = promotionDetail.maxReductionAmount * -1;
            promotionLine.useBudget += promotionDetail.maxReductionAmount;
          }
        } else {
          if (promoAmount >= remainingBudget) {
            promotionHistory.amount = remainingBudget * -1;
            promotionLine.useBudget += remainingBudget;
          } else {
            promotionHistory.amount = promoAmount * -1;
            promotionLine.useBudget += promoAmount;
          }
        }
        promotionLine.useQuantity += promotionHistory.quantity;
        promotionHistory.type = type;
      } else if (type === PromotionHistoryTypeEnum.REFUND) {
        promotionHistory.type = type;
      } else {
        throw new BadRequestException('PROMOTION_HISTORY_TYPE_IS_REQUIRED');
      }

      const savedPromotionHistory = await queryRunnerPH.manager.save(
        promotionHistory,
      );
      await queryRunnerPH.commitTransaction();

      await queryRunnerPL.manager.save(promotionLine);
      await queryRunnerPL.commitTransaction();

      delete savedPromotionHistory.deletedAt;
      delete savedPromotionHistory.order;
      delete savedPromotionHistory.promotionLine;
      return savedPromotionHistory;
    } catch (error) {
      await queryRunnerPL.rollbackTransaction();
      await queryRunnerPH.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
    }
  }
}
