import { PromotionStatusEnum, PromotionTypeEnum } from './../../../enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'KM1' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 'Chương trình khuyến mãi tháng 3/2023' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_LENGTH' })
  name: string;

  @ApiProperty({ example: 'Chương trình khuyến mãi tháng 3/2023' })
  @IsNotEmpty({ message: 'DESCRIPTION_IS_REQUIRED' })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @Length(0, 1000, { message: 'DESCRIPTION_BETWEEN_1_1000_CHARACTERS' })
  description: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'IMAGE_IS_STRING' })
  @IsOptional()
  image: string;

  @ApiProperty({ example: 1000000 })
  @IsNotEmpty({ message: 'BUDGET_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    { message: 'BUDGET_IS_NUMBER' },
  )
  budget: number;

  @ApiProperty({
    example: PromotionTypeEnum.PRODUCT_DISCOUNT_PERCENT,
    enum: PromotionTypeEnum,
  })
  @IsNotEmpty({ message: 'PROMOTION_TYPE_IS_REQUIRED' })
  @IsString({ message: 'PROMOTION_TYPE_IS_STRING' })
  @IsEnum(PromotionTypeEnum, { message: 'PROMOTION_TYPE_IS_ENUM' })
  type: PromotionTypeEnum;

  @ApiProperty({ example: '2023-03-01' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  startDate: Date;

  @ApiProperty({ example: '2023-03-31' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  endDate: Date;

  @ApiPropertyOptional({
    example: PromotionStatusEnum.ACTIVE,
    enum: PromotionStatusEnum,
  })
  @IsString({ message: 'PROMOTION_STATUS_IS_STRING' })
  @IsEnum(PromotionStatusEnum, { message: 'PROMOTION_STATUS_INVALID' })
  @IsOptional()
  status: PromotionStatusEnum;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'MAX_QUANTITY_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_IS_NUMBER' },
  )
  maxQuantity: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNotEmpty({ message: 'MAX_QUANTITY_PER_CUSTOMER_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_PER_CUSTOMER_IS_NUMBER' },
  )
  @IsOptional()
  maxQuantityPerCustomer: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNotEmpty({ message: 'MAX_QUANTITY_PER_CUSTOMER_PER_DAY_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'MAX_QUANTITY_PER_CUSTOMER_PER_DAY_IS_NUMBER' },
  )
  @IsOptional()
  maxQuantityPerCustomerPerDay: number;
}
