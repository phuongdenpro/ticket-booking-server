import { PromotionTypeEnum } from './../../../enums';

export class CreatePromotionLineDto {
  code: string;
  promotionCode: string;
  startDate: Date;
  endDate: Date;
  type: PromotionTypeEnum;
  promotionId: string;
}
