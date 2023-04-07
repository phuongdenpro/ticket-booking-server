import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CalculatePromotionLineDto {
  @ApiProperty({ example: 100000 })
  @IsNotEmpty({ message: 'TOTAL_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    {
      message: 'TOTAL_MUST_BE_NUMBER',
    },
  )
  total: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'NUMBER_OF_TICKET_IS_REQUIRED' })
  @IsInt({ message: 'NUMBER_OF_TICKET_MUST_BE_INTEGER' })
  numOfTicket: number;

  @ApiProperty({ example: ['sa0', 'g'] })
  @IsNotEmpty({ message: 'PROMOTION_LINE_CODES_IS_REQUIRED' })
  @IsString({ each: true, message: 'PROMOTION_LINE_CODES_IS_STRING' })
  promotionLineCodes: string[];
}
