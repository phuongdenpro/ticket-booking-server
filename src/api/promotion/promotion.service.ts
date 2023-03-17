import { PromotionStatusEnum } from './../../enums/promotion-status.enum';
import { IMAGE_REGEX } from './../../utils/regex.util';
import { CreatePromotionDto } from './dto';
import { Promotion, Staff } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('ACCOUNT_IS_NOT_ACTIVE');
    }
    const oldPromotionExist = await this.findOnePromotionByCode(code, {});
    if (oldPromotionExist) {
      throw new BadRequestException('PROMOTION_CODE_EXISTED');
    }

    const promotion = new Promotion();
    promotion.name = name;
    promotion.description = description;
    promotion.note = note;
    if (image) {
      if (!image.match(IMAGE_REGEX)) {
        throw new BadRequestException('INVALID_IMAGE_URL');
      }
      promotion.image = image;
    }
    if (!startDate) {
      throw new BadRequestException('START_DATE_IS_REQUIRED');
    }
    if (startDate > endDate) {
      throw new BadRequestException('START_DATE_MUST_BE_LESS_THAN_END_DATE');
    }
    const currentDate: Date = new Date(`${new Date().toDateString()}`);
    if (startDate < currentDate) {
      throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
    }
    promotion.startDate = startDate;
    if (!endDate) {
      throw new BadRequestException('END_DATE_IS_REQUIRED');
    }
    promotion.endDate = endDate;
    if (status) {
      promotion.status = status;
    } else {
      promotion.status = PromotionStatusEnum.ACTIVE;
    }
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
