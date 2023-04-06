import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ProductDiscountDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'QUANTITY_BUY_MUST_BE_INTEGER' })
  @IsOptional()
  quantityBuy: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'PURCHASE_AMOUNT_MUST_BE_INT' })
  @IsOptional()
  purchaseAmount: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'REDUCTION_AMOUNT_IS_INT' })
  @Min(0, { message: 'REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0' })
  // @IsOptional()
  reductionAmount: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'MAX_REDUCTION_AMOUNT_MUST_BE_INT' })
  @Min(0, { message: 'MAX_REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0' })
  // @IsOptional()
  maxReductionAmount: number;
}

export class ProductDiscountPercentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'QUANTITY_BUY_MUST_BE_INTEGER' })
  @IsOptional()
  quantityBuy: number;

  @ApiPropertyOptional({ example: 0 })
  @IsInt({ message: 'PURCHASE_AMOUNT_MUST_BE_INT' })
  @IsOptional()
  purchaseAmount: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'PERCENT_DISCOUNT_IS_INT' })
  @Min(1, { message: 'PERCENT_DISCOUNT_GREATER_THAN_OR_EQUAL_TO_1' })
  // @IsOptional()
  percentDiscount: number;

  @ApiProperty({ example: 10000 })
  @IsInt({ message: 'MAX_REDUCTION_AMOUNT_MUST_BE_INT' })
  @Min(0, { message: 'MAX_REDUCTION_AMOUNT_GREATER_THAN_OR_EQUAL_TO_0' })
  // @IsOptional()
  maxReductionAmount: number;
}

// export class ProductGiveawayDto {
//   @ApiProperty({ example: 1 })
//   @IsInt({ message: 'QUANTITY_BUY_MUST_BE_INTEGER' })
//   @Min(1, { message: 'QUANTITY_BUY_MUST_BE_GREATER_THAN_0' })
//   @IsOptional()
//   quantityBuy: number;

//   @ApiProperty({ example: 1 })
//   @IsInt({ message: 'PURCHASE_AMOUNT_MUST_BE_INT' })
//   @Min(0, { message: 'PURCHASE_AMOUNT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0' })
//   @IsOptional()
//   purchaseAmount: number;

//   @ApiProperty({ example: 1 })
//   @IsInt({ message: 'QUANTITY_RECEIVE_IS_INT' })
//   @Min(1, { message: 'QUANTITY_RECEIVE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_1' })
//   @IsOptional()
//   quantityReceive: number;
// }
