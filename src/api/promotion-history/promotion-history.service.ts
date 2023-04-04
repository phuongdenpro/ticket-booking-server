import { InjectRepository } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  PromotionHistory,
  PromotionLine,
} from './../../database/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

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

  async createPromotionHistory(dto, userId: string) {
    const {} = dto;
  }
}
