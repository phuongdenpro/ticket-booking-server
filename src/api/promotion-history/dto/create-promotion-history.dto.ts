import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromotionHistoryDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'AMOUNT_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    { message: 'AMOUNT_IS_NUMBER' },
  )
  amount: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'AMOUNT_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'QUANTITY_IS_NUMBER' },
  )
  quantity: number;

  @ApiProperty({ example: '' })
  type: string;

  @ApiProperty({ example: '' })
  promotionLineCode: string;

  @ApiProperty({ example: '' })
  orderCode: string;
}
