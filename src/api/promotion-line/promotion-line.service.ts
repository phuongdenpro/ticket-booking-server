import { CreatePromotionLineDto } from './dto';
import { PromotionTypeEnum, SortEnum } from './../../enums';
import { Promotion, PromotionLine } from './../../database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PromotionLineService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionLine)
    private readonly promotionLineRepository: Repository<PromotionLine>,
    private dataSource: DataSource,
  ) {}

  // promotion
  async findOnePromotion(options: any) {
    return await this.promotionRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options?.other,
    });
  }

  async findOnePromotionLine(options: any) {
    return await this.promotionLineRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options?.other,
    });
  }

  async findOnePromotionLineByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOnePromotionLine(options);
  }

  async findOnePromotionLineById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOnePromotionLine(options);
  }

  async getPromotionLineById(id: string, options?: any) {
    const line = await this.findOnePromotionLineById(id, options);
    if (!line) {
      throw new NotFoundException('PROMOTION_LINE_NOT_FOUND');
    }
    return line;
  }

  async getPromotionLineByCode(code: string, options?: any) {
    const line = await this.findOnePromotionLineByCode(code, options);
    if (!line) {
      throw new NotFoundException('PROMOTION_LINE_NOT_FOUND');
    }
    return line;
  }

  async createPromotionLine(dto: CreatePromotionLineDto, adminId: string) {
    const {
      code,
      title,
      description,
      note,
      budget,
      max_quantity,
      max_quantity_per_customer,
      startDate,
      endDate,
      type,
      promotionCode,
      couponCode,
    } = dto;

    const promotionLineExist = await this.findOnePromotionLineByCode(code, {
      other: { withDeleted: true },
    });
    if (promotionLineExist) {
      throw new NotFoundException('PROMOTION_LINE_CODE_ALREADY_EXIST');
    }

    const promotionLine = new PromotionLine();
    promotionLine.code = code;
    if (!promotionCode) {
      throw new NotFoundException('PROMOTION_CODE_IS_REQUIRED');
    }
    const promotion = await this.findOnePromotion({
      where: { code: promotionCode },
    });
    if (!promotion) {
      throw new NotFoundException('PROMOTION_NOT_FOUND');
    }
    promotionLine.promotion = promotion;
    promotionLine.title = title;
    promotionLine.description = description;
    promotionLine.note = note;
    if (budget < 0) {
      throw new NotFoundException('BUDGET_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.budget = budget;
    if (max_quantity < 0) {
      throw new NotFoundException('MAX_QUANTITY_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.max_quantity = max_quantity;
    if (max_quantity_per_customer < 0) {
      throw new NotFoundException(
        'MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0',
      );
    }
    promotionLine.max_quantity_per_customer = max_quantity_per_customer;
    switch (type) {
      case PromotionTypeEnum.PRODUCT_GIVEAWAYS:
        promotionLine.type = PromotionTypeEnum.PRODUCT_GIVEAWAYS;
        break;
      case PromotionTypeEnum.PRODUCT_DISCOUNT:
        promotionLine.type = PromotionTypeEnum.PRODUCT_DISCOUNT;
        break;
      default:
        promotionLine.type = PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT;
        break;
    }
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new NotFoundException('START_DATE_GREATER_THAN_NOW');
    }
    if (endDate < currentDate) {
      throw new NotFoundException('END_DATE_GREATER_THAN_NOW');
    }
    if (endDate < startDate) {
      throw new NotFoundException('END_DATE_GREATER_THAN_START_DATE');
    }
    promotionLine.startDate = startDate;
    promotionLine.endDate = endDate;
    promotionLine.couponCode = couponCode;
    promotionLine.createdBy = adminId;
    return await this.promotionLineRepository.save(promotionLine);
  }
}
