import { CreatePromotionLineDto, UpdatePromotionLineDto } from './dto';
import { PromotionTypeEnum, SortEnum } from './../../enums';
import { Promotion, PromotionLine, Staff } from './../../database/entities';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      maxBudget,
      maxQuantity,
      maxQuantityPerCustomer,
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
    if (maxBudget < 0) {
      throw new NotFoundException('BUDGET_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.maxBudget = maxBudget;
    if (maxQuantity < 0) {
      throw new NotFoundException('MAX_QUANTITY_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.max_quantity = maxQuantity;
    if (maxQuantityPerCustomer < 0) {
      throw new NotFoundException(
        'MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0',
      );
    }
    promotionLine.maxQuantityPerCustomer = maxQuantityPerCustomer;
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

  async updatePromotionLineById(
    id: string,
    dto: UpdatePromotionLineDto,
    adminId: string,
  ) {
    const {
      maxBudget,
      couponCode,
      description,
      endDate,
      maxQuantity,
      maxQuantityPerCustomer,
      note,
      startDate,
      title,
      type,
    } = dto;
    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!adminExist) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const promotionLine = await this.getPromotionLineById(id);
    if (!promotionLine) {
      throw new NotFoundException('PROMOTION_LINE_NOT_FOUND');
    }
    if (maxBudget) {
      if (maxBudget < 0) {
        throw new NotFoundException('BUDGET_MUST_BE_GREATER_THAN_0');
      }
      promotionLine.maxBudget = maxBudget;
    }
  }

  // async updatePromotionLineByCode(id: string, dto, adminId: string) {}
}
