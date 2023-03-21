import { SortEnum, PromotionStatusEnum } from './../../enums';
import { IMAGE_REGEX } from './../../utils/regex.util';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';
import { Promotion, Staff } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment';
moment.locale('vi');

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private dataSource: DataSource,
  ) {}

  async findOnePromotion(options: any) {
    return await this.promotionRepository.findOne({
      where: { ...options?.where },
      relations: [].concat(options?.relations || []),
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

  async findOnePromotionByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOnePromotion(options);
  }

  async findOnePromotionById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOnePromotion(options);
  }

  async getPromotionById(id: string) {
    const promotion = await this.findOnePromotionById(id);
    if (!promotion) {
      throw new BadRequestException('PROMOTION_NOT_FOUND');
    }
    return promotion;
  }

  async getPromotionByCode(code: string) {
    const promotion = await this.findOnePromotionByCode(code);
    if (!promotion) {
      throw new BadRequestException('PROMOTION_NOT_FOUND');
    }
    return promotion;
  }

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

    const oldPromotionExist = await this.findOnePromotionByCode(code, {
      withDeleted: true,
    });
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

    // get current date by moment js\
    const currentDate = new Date(moment().format('YYYY-MM-DD'));
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
    const savePromotion = await this.promotionRepository.save(promotion);
    delete promotion.deletedAt;
    return savePromotion;
  }

  async updatePromotionById(
    id: string,
    dto: UpdatePromotionDto,
    adminId: string,
  ) {
    const { name, description, note, image, startDate, endDate, status } = dto;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('ACCOUNT_IS_NOT_ACTIVE');
    }

    const promotion = await this.findOnePromotionById(id);
    if (!promotion) {
      throw new BadRequestException('PROMOTION_NOT_FOUND');
    }
    if (name) {
      promotion.name = name;
    }
    if (description) {
      promotion.description = description;
    }
    if (note) {
      promotion.note = note;
    }
    if (image) {
      promotion.image = image;
    }
    if (status) {
      switch (status) {
        case PromotionStatusEnum.ACTIVE:
          promotion.status = PromotionStatusEnum.ACTIVE;
          break;
        case PromotionStatusEnum.INACTIVE:
          promotion.status = PromotionStatusEnum.INACTIVE;
          break;
        case PromotionStatusEnum.OUT_OF_BUDGET:
          promotion.status = PromotionStatusEnum.OUT_OF_BUDGET;
          break;
        case PromotionStatusEnum.OUT_OF_QUANTITY:
          promotion.status = PromotionStatusEnum.OUT_OF_QUANTITY;
          break;
        case PromotionStatusEnum.OUT_OR_DATE:
          promotion.status = PromotionStatusEnum.OUT_OR_DATE;
          break;
        default:
          break;
      }
    }

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    if (startDate) {
      if (!endDate) {
        if (startDate > promotion.endDate) {
          throw new BadRequestException(
            'START_DATE_MUST_BE_LESS_THAN_END_DATE',
          );
        }
      }
      if (startDate < currentDate) {
        throw new BadRequestException('START_DATE_GREATER_THAN_NOW');
      }
      if (promotion.status === PromotionStatusEnum.ACTIVE) {
        throw new BadRequestException('PROMOTION_STATUS_IS_ON_ACTIVE');
      }
      promotion.startDate = startDate;
    }
    if (endDate) {
      if (!startDate) {
        if (promotion.startDate > endDate) {
          throw new BadRequestException(
            'START_DATE_MUST_BE_LESS_THAN_END_DATE',
          );
        }
      } else {
        if (startDate > endDate) {
          throw new BadRequestException(
            'START_DATE_MUST_BE_LESS_THAN_END_DATE',
          );
        }
      }
      if (endDate < currentDate) {
        throw new BadRequestException('END_DATE_GREATER_THAN_NOW');
      }
      promotion.endDate = endDate;
    }
  }
}
