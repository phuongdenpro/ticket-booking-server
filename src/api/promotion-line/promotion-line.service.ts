import { Pagination } from './../../decorator';
import { ApplicableTicketGroupService } from './../applicable-ticket-group/applicable-ticket-group.service';
import {
  CreatePromotionLineDto,
  ProductGiveawayDto,
  ProductDiscountDto,
  ProductDiscountPercentDto,
  UpdatePromotionLineDto,
  FilterPromotionLineDto,
} from './dto';
import { PromotionTypeEnum, SortEnum } from './../../enums';
import {
  Promotion,
  PromotionDetail,
  PromotionLine,
  Staff,
  TicketGroup,
} from './../../database/entities';
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
    @InjectRepository(PromotionDetail)
    private readonly promotionDetailRepository: Repository<PromotionDetail>,
    private readonly applicableTGService: ApplicableTicketGroupService,
    private dataSource: DataSource,
  ) {}

  // valid
  private async validProductGiveaway(
    dto: ProductGiveawayDto,
    savePromotionLine: PromotionLine,
  ) {
    const { quantityBuy, quantityReceive, purchaseAmount } = dto;

    const promotionDetail = new PromotionDetail();
    promotionDetail.promotionLine = savePromotionLine;
    if (!quantityBuy) {
      throw new BadRequestException('QUANTITY_BUY_IS_REQUIRED');
    }
    if (quantityBuy < 1) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_GREATER_THAN_0');
    }
    if (!Number.isInteger(quantityBuy)) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_INTEGER');
    }
    promotionDetail.quantityBuy = quantityBuy;

    if (!quantityReceive) {
      throw new BadRequestException('QUANTITY_RECEIVE_IS_REQUIRED');
    }
    if (quantityReceive < 1) {
      throw new BadRequestException(
        'QUANTITY_RECEIVE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_1',
      );
    }
    if (!Number.isInteger(quantityReceive)) {
      throw new BadRequestException('QUANTITY_RECEIVE_IS_INT');
    }
    promotionDetail.quantityReceive = quantityReceive;
    if (!purchaseAmount && purchaseAmount !== 0) {
      throw new BadRequestException('PURCHASE_AMOUNT_IS_REQUIRED');
    }
    if (purchaseAmount < 0) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(purchaseAmount)) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    promotionDetail.purchaseAmount = purchaseAmount;

    return promotionDetail;
  }

  private async validProductDiscount(
    dto: ProductDiscountDto,
    savePromotionLine: PromotionLine,
  ) {
    const { quantityBuy, purchaseAmount, maxReductionAmount, reductionAmount } =
      dto;
    const promotionDetail = new PromotionDetail();
    promotionDetail.promotionLine = savePromotionLine;
    if (!quantityBuy) {
      throw new BadRequestException('QUANTITY_BUY_IS_REQUIRED');
    }
    if (quantityBuy < 1) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_GREATER_THAN_0');
    }
    if (!Number.isInteger(quantityBuy)) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_INTEGER');
    }
    promotionDetail.quantityBuy = quantityBuy;

    if (!purchaseAmount && purchaseAmount !== 0) {
      throw new BadRequestException('PURCHASE_AMOUNT_IS_REQUIRED');
    }
    if (purchaseAmount < 0) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(purchaseAmount)) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    promotionDetail.purchaseAmount = purchaseAmount;

    if (!maxReductionAmount && maxReductionAmount !== 0) {
      throw new BadRequestException('MAX_REDUCTION_AMOUNT_IS_REQUIRED');
    }
    if (maxReductionAmount < 0) {
      throw new BadRequestException(
        'MAX_REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(maxReductionAmount)) {
      throw new BadRequestException('MAX_REDUCTION_AMOUNT_MUST_BE_INT');
    }
    promotionDetail.maxReductionAmount = maxReductionAmount;

    if (!reductionAmount && reductionAmount !== 0) {
      throw new BadRequestException('REDUCTION_AMOUNT_IS_REQUIRED');
    }
    if (reductionAmount < 0) {
      throw new BadRequestException(
        'REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(reductionAmount)) {
      throw new BadRequestException('REDUCTION_AMOUNT_IS_INT');
    }
    promotionDetail.reductionAmount = reductionAmount;

    return promotionDetail;
  }

  private async validProductDiscountPercent(
    dto: ProductDiscountPercentDto,
    savePromotionLine: PromotionLine,
  ) {
    const { quantityBuy, purchaseAmount, maxReductionAmount, percentDiscount } =
      dto;
    const promotionDetail = new PromotionDetail();
    promotionDetail.promotionLine = savePromotionLine;
    if (!quantityBuy) {
      throw new BadRequestException('QUANTITY_BUY_IS_REQUIRED');
    }
    if (quantityBuy < 1) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_GREATER_THAN_0');
    }
    if (!Number.isInteger(quantityBuy)) {
      throw new BadRequestException('QUANTITY_BUY_MUST_BE_INTEGER');
    }
    promotionDetail.quantityBuy = quantityBuy;

    if (!purchaseAmount && purchaseAmount !== 0) {
      throw new BadRequestException('PURCHASE_AMOUNT_IS_REQUIRED');
    }
    if (purchaseAmount < 0) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(purchaseAmount)) {
      throw new BadRequestException(
        'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    promotionDetail.purchaseAmount = purchaseAmount;

    if (!maxReductionAmount && maxReductionAmount !== 0) {
      throw new BadRequestException('MAX_REDUCTION_AMOUNT_IS_REQUIRED');
    }
    if (maxReductionAmount < 0) {
      throw new BadRequestException(
        'MAX_REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0',
      );
    }
    if (!Number.isInteger(maxReductionAmount)) {
      throw new BadRequestException('MAX_REDUCTION_AMOUNT_MUST_BE_INT');
    }
    promotionDetail.maxReductionAmount = maxReductionAmount;

    if (!percentDiscount) {
      throw new BadRequestException('PERCENT_DISCOUNT_IS_REQUIRED');
    }
    if (percentDiscount < 1) {
      throw new BadRequestException(
        'PERCENT_DISCOUNT_GREATER_THAN_OR_EQUAL_TO_1',
      );
    }
    if (percentDiscount > 100) {
      throw new BadRequestException(
        'PERCENT_DISCOUNT_LESS_THAN_OR_EQUAL_TO_100',
      );
    }
    if (!Number.isInteger(percentDiscount)) {
      throw new BadRequestException('PERCENT_DISCOUNT_IS_INT');
    }
    promotionDetail.percentDiscount = percentDiscount;

    return promotionDetail;
  }

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
        promotionDetail: true,
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

  async findAllPromotionLine(
    dto: FilterPromotionLineDto,
    pagination?: Pagination,
  ) {
    const {
      keywords,
      minUseBudget,
      maxUseBudget,
      minOfMaxBudget,
      maxOfMaxBudget,
      minUseQuantity,
      maxUseQuantity,
      maxOfMaxQuantity,
      minOfMaxQuantity,
      minOfMaxQuantityPerCustomer,
      maxOfMaxQuantityPerCustomer,
      startDate,
      endDate,
      type,
      promotionCode,
      sort,
    } = dto;
    const query = this.promotionLineRepository.createQueryBuilder('q');
    if (keywords) {
      const subQuery = this.promotionLineRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${keywords}%` })
        .orWhere('q2.couponCode LIKE :couponCode', {
          couponCode: `%${keywords}%`,
        })
        .where('q2.title LIKE :title', { title: `%${keywords}%` })
        .where('q2.description LIKE :description', {
          description: `%${keywords}%`,
        })
        .where('q2.note LIKE :note', { note: `%${keywords}%` })
        .getQuery();

      query.andWhere(`EXISTS ${subQuery}`, {});
    }
    if (promotionCode) {
      query.leftJoinAndSelect('q.promotion', 'p');
      query.andWhere('p.code = :promotionCode', { promotionCode });
    }
    if (startDate) {
      query.andWhere('q.startDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('q.endDate <= :endDate', { endDate });
    }
    switch (type) {
      case PromotionTypeEnum.PRODUCT_DISCOUNT:
      case PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT:
      case PromotionTypeEnum.PRODUCT_GIVEAWAYS:
        query.andWhere('q.type = :type', { type });
        break;
      default:
        break;
    }
    if (minUseQuantity) {
      query.andWhere('q.useQuantity >= :minUseQuantity', { minUseQuantity });
    }
    if (maxUseQuantity) {
      query.andWhere('q.useQuantity <= :maxUseQuantity', { maxUseQuantity });
    }
    if (minUseBudget) {
      query.andWhere('q.useBudget >= :minUseBudget', { minUseBudget });
    }
    if (maxUseBudget) {
      query.andWhere('q.useBudget <= :maxUseBudget', { maxUseBudget });
    }
    if (minOfMaxQuantity) {
      query.andWhere('q.maxQuantity >= :minOfMaxQuantity', {
        minOfMaxQuantity,
      });
    }
    if (maxOfMaxQuantity) {
      query.andWhere('q.maxQuantity <= :maxOfMaxQuantity', {
        maxOfMaxQuantity,
      });
    }
    if (minOfMaxBudget) {
      query.andWhere('q.maxBudget >= :minOfMaxBudget', {
        minOfMaxBudget,
      });
    }
    if (maxOfMaxBudget) {
      query.andWhere('q.maxBudget <= :maxOfMaxBudget', {
        maxOfMaxBudget,
      });
    }
    if (minOfMaxQuantityPerCustomer) {
      query.andWhere(
        'q.maxQuantityPerCustomer >= :minOfMaxQuantityPerCustomer',
        {
          minOfMaxQuantityPerCustomer,
        },
      );
    }
    if (maxOfMaxQuantityPerCustomer) {
      query.andWhere(
        'q.maxQuantityPerCustomer <= :maxOfMaxQuantityPerCustomer',
        {
          maxOfMaxQuantityPerCustomer,
        },
      );
    }

    query
      .orderBy('q.title', sort || SortEnum.DESC)
      .orderBy('q.code', sort || SortEnum.DESC)
      .orderBy('q.couponCode', sort || SortEnum.DESC)
      .addOrderBy('q.createdAt', sort || SortEnum.DESC);

    const dataResult = await query
      .offset(pagination.skip ?? 0)
      .limit(pagination.take ?? 10)
      .getMany();
    const total = await query.clone().getCount();

    return { dataResult, total, pagination };
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
      ticketGroupCode,
      productDiscount,
      productDiscountPercent,
      productGiveaway,
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

    const promotionLine = new PromotionLine();
    if (!promotionCode) {
      throw new BadRequestException('PROMOTION_CODE_IS_REQUIRED');
    }
    const promotion = await this.findOnePromotion({
      where: { code: promotionCode },
    });
    if (!promotion) {
      throw new BadRequestException('PROMOTION_NOT_FOUND');
    }
    promotionLine.promotion = promotion;

    const promotionLineCodeExist = await this.findOnePromotionLineByCode(code, {
      other: { withDeleted: true },
    });
    if (promotionLineCodeExist) {
      throw new BadRequestException('PROMOTION_LINE_CODE_ALREADY_EXIST');
    }
    promotionLine.code = code;

    promotionLine.title = title;
    promotionLine.description = description;
    promotionLine.note = note;
    if (maxBudget < 0) {
      throw new BadRequestException('BUDGET_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.maxBudget = maxBudget;

    if (!Number.isInteger(maxQuantity)) {
      throw new BadRequestException('MAX_QUANTITY_MUST_BE_INT');
    }
    if (maxQuantity < 0) {
      throw new BadRequestException('MAX_QUANTITY_MUST_BE_GREATER_THAN_0');
    }
    promotionLine.maxQuantity = maxQuantity;

    if (!Number.isInteger(maxQuantityPerCustomer)) {
      throw new BadRequestException('MAX_QUANTITY_MUST_BE_INT');
    }
    if (maxQuantityPerCustomer < 0) {
      throw new BadRequestException(
        'MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0',
      );
    }
    promotionLine.maxQuantityPerCustomer = maxQuantityPerCustomer;

    switch (type) {
      case PromotionTypeEnum.PRODUCT_GIVEAWAYS:
      case PromotionTypeEnum.PRODUCT_DISCOUNT:
      case PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT:
        promotionLine.type = type;
        break;
      default:
        throw new BadRequestException('PROMOTION_LINE_TYPE_IS_ENUM');
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    if (endDate < currentDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
    }
    if (endDate < startDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_START_DATE');
    }
    promotionLine.startDate = startDate;
    promotionLine.endDate = endDate;

    const promotionLineCouponCodeExist = await this.findOnePromotionLine({
      where: { couponCode },
      other: { withDeleted: true },
    });
    if (promotionLineCouponCodeExist) {
      throw new BadRequestException('PROMOTION_LINE_COUPON_CODE_ALREADY_EXIST');
    }
    promotionLine.couponCode = couponCode;

    promotionLine.createdBy = adminId;
    let savePromotionLine;
    let savePromotionDetail;
    let applicableTG;
    try {
      savePromotionLine = await this.promotionLineRepository.save(
        promotionLine,
      );
      let promotionDetail: PromotionDetail;
      if (type === PromotionTypeEnum.PRODUCT_GIVEAWAYS && productGiveaway) {
        promotionDetail = await this.validProductGiveaway(
          productGiveaway,
          savePromotionLine,
        );
      } else if (
        type === PromotionTypeEnum.PRODUCT_DISCOUNT &&
        productDiscount
      ) {
        promotionDetail = await this.validProductDiscount(
          productDiscount,
          savePromotionLine,
        );
      } else if (
        type == PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT &&
        productDiscountPercent
      ) {
        promotionDetail = await this.validProductDiscountPercent(
          productDiscountPercent,
          savePromotionLine,
        );
      } else {
        throw new BadRequestException('PROMOTION_LINE_TYPE_IS_ENUM');
      }
      promotionDetail.promotionLineCode = savePromotionLine.code;
      savePromotionDetail = await this.promotionDetailRepository.save(
        promotionDetail,
      );

      applicableTG = await this.applicableTGService.createApplicableTicketGroup(
        {
          promotionDetailId: savePromotionDetail.id,
          ticketGroupCode,
        },
        adminExist.id,
      );
      delete savePromotionLine.promotion;
      delete savePromotionDetail.promotionLine;
      delete savePromotionDetail.deletedAt;
      savePromotionLine.promotionDetail = savePromotionDetail;
      return savePromotionLine;
    } catch (error) {
      if (applicableTG) {
        await this.applicableTGService.removeApplicableTicketGroup(
          {
            promotionDetailId: savePromotionDetail.id,
            ticketGroupCode,
          },
          adminId,
        );
      }
      if (savePromotionDetail) {
        await this.promotionDetailRepository.remove(savePromotionDetail);
      }
      if (savePromotionLine) {
        await this.promotionLineRepository.remove(savePromotionLine);
      }
      return error;
    }
  }

  async updatePromotionLineById(
    id: string,
    dto: UpdatePromotionLineDto,
    adminId: string,
  ) {
    const {
      title,
      description,
      note,
      maxBudget,
      maxQuantity,
      maxQuantityPerCustomer,
      startDate,
      endDate,
      type,
      couponCode,
      ticketGroupCode,
      productDiscount,
      productDiscountPercent,
      productGiveaway,
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

    const promotionLine = await this.findOnePromotionLineById(id, {
      relations: {
        promotionDetail: true,
      },
    });
    if (!promotionLine) {
      throw new BadRequestException('PROMOTION_LINE_NOT_FOUND');
    }
    if (title) {
      promotionLine.title = title;
    }
    if (description) {
      promotionLine.description = description;
    }
    if (note) {
      promotionLine.note = note;
    }

    if (maxBudget) {
      if (maxBudget < 0) {
        throw new BadRequestException('BUDGET_MUST_BE_GREATER_THAN_0');
      }
      if (maxBudget < promotionLine.useBudget) {
        throw new BadRequestException(
          'BUDGET_MUST_BE_GREATER_THAN_USED_BUDGET',
        );
      }
      promotionLine.maxBudget = maxBudget;
    }

    if (maxQuantity) {
      if (maxQuantity < 0) {
        throw new BadRequestException('MAX_QUANTITY_MUST_BE_GREATER_THAN_0');
      }
      if (maxQuantity < promotionLine.useQuantity) {
        throw new BadRequestException(
          'MAX_QUANTITY_MUST_BE_GREATER_THAN_USED_QUANTITY',
        );
      }
      promotionLine.maxQuantity = maxQuantity;
    }

    if (maxQuantityPerCustomer) {
      if (maxQuantityPerCustomer < 0) {
        throw new BadRequestException(
          'MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0',
        );
      }
      promotionLine.maxQuantityPerCustomer = maxQuantityPerCustomer;
    }

    switch (type) {
      case PromotionTypeEnum.PRODUCT_GIVEAWAYS:
      case PromotionTypeEnum.PRODUCT_DISCOUNT:
      case PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT:
        promotionLine.type = type;
        break;
      default:
        break;
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    if (endDate < currentDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
    }
    if (endDate < startDate) {
      throw new BadRequestException('END_DATE_GREATER_THAN_START_DATE');
    }
    promotionLine.startDate = startDate;
    promotionLine.endDate = endDate;

    if (couponCode) {
      const promotionLineCouponCodeExist = await this.findOnePromotionLine({
        where: { couponCode },
        other: { withDeleted: true },
      });
      if (promotionLineCouponCodeExist) {
        throw new BadRequestException(
          'PROMOTION_LINE_COUPON_CODE_ALREADY_EXIST',
        );
      }
      promotionLine.couponCode = couponCode;
    }

    promotionLine.updatedBy = adminId;
    const savePromotionLine = await this.promotionLineRepository.save(
      promotionLine,
    );

    if (ticketGroupCode) {
      const ticketGroup = await this.dataSource
        .getRepository(TicketGroup)
        .findOne({
          where: { code: ticketGroupCode },
        });
      if (!ticketGroup) {
        throw new BadRequestException('TICKET_GROUP_NOT_FOUND');
      }

      let promotionDetail;
      if (type === PromotionTypeEnum.PRODUCT_GIVEAWAYS) {
        promotionDetail = await this.validProductGiveaway(
          productGiveaway,
          savePromotionLine,
        );
      } else if (type === PromotionTypeEnum.PRODUCT_DISCOUNT) {
        promotionDetail = await this.validProductDiscount(
          productDiscount,
          savePromotionLine,
        );
      } else if (type == PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT) {
        promotionDetail = await this.validProductDiscountPercent(
          productDiscountPercent,
          savePromotionLine,
        );
      } else {
        throw new BadRequestException('PROMOTION_LINE_TYPE_IS_ENUM');
      }
      const savePromotionDetail = await this.promotionDetailRepository.save(
        promotionDetail,
      );
      savePromotionLine.promotionDetail = savePromotionDetail;
    }

    return savePromotionLine;
  }

  // promotion detail
  async findOnePromotionDetail(options: any) {
    return await this.promotionDetailRepository.findOne({
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

  async findOnePromotionDetailByCode(code: string, options?: any) {}

  async findOnePromotionDetailById(id: string, options?: any) {}
}
