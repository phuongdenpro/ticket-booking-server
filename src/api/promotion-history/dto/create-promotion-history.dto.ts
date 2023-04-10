import { PromotionHistoryTypeEnum } from '../../../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePromotionHistoryDto {
  @ApiProperty({ example: PromotionHistoryTypeEnum.PRODUCT_DISCOUNT_PERCENT })
  @IsNotEmpty({ message: 'PROMOTION_HISTORY_TYPE_IS_REQUIRED' })
  @IsEnum(PromotionHistoryTypeEnum, {
    message: 'PROMOTION_HISTORY_TYPE_IS_ENUM',
  })
  type: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'PROMOTION_LINE_CODE_IS_REQUIRED' })
  @IsString({ message: 'PROMOTION_LINE_CODE_IS_STRING' })
  @Length(1, 100, { message: 'PROMOTION_LINE_CODE_BETWEEN_1_100_CHARACTERS' })
  promotionLineCode: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'ORDER_CODE_IS_REQUIRED' })
  @IsString({ message: 'ORDER_CODE_MUST_BE_STRING' })
  @Length(1, 100, { message: 'ORDER_CODE_BETWEEN_1_100_CHARACTERS' })
  orderCode: string;
}
