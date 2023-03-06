import { PromotionStatusEnum } from './../../enums/promotion-status.enum';
import { IMAGE_REGEX } from './../../utils/regex.util';
import { CreatePromotionDto } from './dto';
import { Promotion, Staff } from './../../database/entities';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly priceListRepository: Repository<Promotion>,
    private dataSource: DataSource,
  ) {}

  async createPromotion(dto: CreatePromotionDto, adminId: string) {
    const { name, description, note, image, startDate, endDate, status, code } =
      dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const oldPromotionExist = await this.findOnePromotionByCode(code, {});
    if (oldPromotionExist) {
      throw new UnauthorizedException('PROMOTION_CODE_EXISTED');
    }

    const promotion = new Promotion();
    promotion.name = name;
    promotion.description = description;
    promotion.note = note;
    if (image) {
      if (!image.match(IMAGE_REGEX)) {
        throw new UnauthorizedException('INVALID_IMAGE_URL');
      }
      promotion.image = image;
    }
    if (!startDate) {
      throw new UnauthorizedException('START_DATE_IS_REQUIRED');
    }
    if (startDate > endDate) {
      throw new UnauthorizedException('START_DATE_MUST_BE_LESS_THAN_END_DATE');
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate < currentDate) {
      throw new UnauthorizedException('START_DATE_GREATER_THAN_NOW');
    }
    promotion.startDate = startDate;
    if (!endDate) {
      throw new UnauthorizedException('END_DATE_IS_REQUIRED');
    }
    promotion.endDate = endDate;
    if (status) {
      promotion.status = status;
    } else {
      promotion.status = PromotionStatusEnum.ACTIVE;
    }
    // if (maxQuantity) {
    //   if (maxQuantity < 0) {
    //     throw new UnauthorizedException('MAX_QUANTITY_MUST_BE_GREATER_THAN_0');
    //   }
    // promotion.maxQuantity = maxQuantity;
    // }
    // if (maxQuantityPerCustomer) {
    //   if (maxQuantityPerCustomer < 0) {
    //     throw new UnauthorizedException(
    //       'MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0',
    //     );
    //   }
    // promotion.maxQuantityPerCustomer = maxQuantityPerCustomer;
    // }
    // if (maxQuantityPerCustomerPerDay) {
    //   if (maxQuantityPerCustomerPerDay < 0) {
    //     throw new UnauthorizedException(
    //       'MAX_QUANTITY_PER_CUSTOMER_PER_DAY_MUST_BE_GREATER_THAN_0',
    //     );
    //   }
    // promotion.maxQuantityPerCustomerPerDay = maxQuantityPerCustomerPerDay;
    // }
    promotion.createdBy = adminExist.id;
    // const savePromotion = await this.priceListRepository.save(promotion);
    // delete promotion.deletedAt;
    // return savePromotion;
  }

  async findOnePromotionByCode(
    code: string,
    options?: any,
    whereOptions?: any,
  ) {
    return await this.priceListRepository.findOne({
      where: { code, ...whereOptions },
      ...options,
    });
  }
}
