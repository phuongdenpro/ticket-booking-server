import { PromotionTypeEnum } from './../../../enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsEnum,
  IsDate,
  MinDate,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePromotionLineDto {
  @ApiProperty({ example: 'KM1' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'TITLE_IS_REQUIRED' })
  @IsString({ message: 'TITLE_IS_STRING' })
  @Length(1, 100, { message: 'TITLE_LENGTH' })
  title: string;

  @ApiProperty({ example: 'Chương trình khuyến mãi tháng 3/2023' })
  @IsNotEmpty({ message: 'DESCRIPTION_IS_REQUIRED' })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @Length(0, 1000, { message: 'DESCRIPTION_BETWEEN_1_1000_CHARACTERS' })
  description: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'COUPON_CODE_IS_REQUIRED' })
  @IsString({ message: 'COUPON_CODE_IS_STRING' })
  @Length(1, 100, { message: 'COUPON_CODE_BETWEEN_1_100_CHARACTERS' })
  couponCode: string;

  @ApiProperty({ example: '2023-03-01' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'START_DATE_GREATER_THAN_NOW',
  })
  startDate: Date;

  @ApiProperty({ example: '2023-03-31' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'END_DATE_GREATER_THAN_NOW',
  })
  endDate: Date;

  @ApiPropertyOptional({
    example: PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT,
    enum: PromotionTypeEnum,
  })
  @IsNotEmpty({ message: 'PROMOTION_LINE_TYPE_IS_REQUIRED' })
  @IsString({ message: 'PROMOTION_LINE_TYPE_IS_STRING' })
  @IsEnum(PromotionTypeEnum, { message: 'PROMOTION_LINE_TYPE_IS_ENUM' })
  type: PromotionTypeEnum;

  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: 'MAX_QUANTITY_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_IS_NUMBER' },
  )
  @Min(1, { message: 'MAX_QUANTITY_MIN_1' })
  max_quantity: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: 'MAX_QUANTITY_PER_CUSTOMER_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_PER_CUSTOMER_IS_NUMBER' },
  )
  @Min(0, { message: 'MAX_QUANTITY_PER_CUSTOMER_MIN_1' })
  max_quantity_per_customer: number;

  @ApiProperty({ example: 1_000_000 })
  @IsNotEmpty({ message: 'BUDGET_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    { message: 'BUDGET_IS_NUMBER' },
  )
  @Min(0, { message: 'BUDGET_MUST_BE_GREATER_THAN_0' })
  budget: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'PROMOTION_CODE_IS_REQUIRED' })
  @IsString({ message: 'PROMOTION_CODE_IS_STRING' })
  @Length(36, 36, { message: 'PROMOTION_CODE_BETWEEN_1_100_CHARACTERS' })
  promotionCode: string;
}
