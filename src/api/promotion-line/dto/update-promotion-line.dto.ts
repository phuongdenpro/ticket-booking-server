import { PromotionTypeEnum } from '../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  MinDate,
  IsNumber,
} from 'class-validator';

export class UpdatePromotionLineDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TITLE_IS_STRING' })
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ example: 'Chương trình khuyến mãi tháng 3/2023' })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'COUPON_CODE_IS_STRING' })
  @IsOptional()
  couponCode: string;

  @ApiPropertyOptional({ example: '2023-03-01' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'START_DATE_GREATER_THAN_NOW',
  })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-03-31' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'END_DATE_GREATER_THAN_NOW',
  })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({
    example: PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT,
    enum: PromotionTypeEnum,
  })
  @IsString({ message: 'PROMOTION_LINE_TYPE_IS_STRING' })
  @IsEnum(PromotionTypeEnum, { message: 'PROMOTION_LINE_TYPE_IS_ENUM' })
  @IsOptional()
  type: PromotionTypeEnum;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_IS_NUMBER' },
  )
  @IsOptional()
  maxQuantity: number;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_PER_CUSTOMER_IS_NUMBER' },
  )
  @IsOptional()
  maxQuantityPerCustomer: number;

  @ApiPropertyOptional({ example: 1_000_000 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    { message: 'BUDGET_IS_NUMBER' },
  )
  @IsOptional()
  maxBudget: number;
}
