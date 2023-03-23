import { PromotionTypeEnum } from './../../../enums';

export class CreatePromotionLineDto {
  code: string;
  title: string;
  description: string;
  note: string;
  promotionCode: string;
  startDate: Date;
  endDate: Date;
  type: PromotionTypeEnum;
  promotionId: string;
}
