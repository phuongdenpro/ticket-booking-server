import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePriceDetailDto {
  @ApiPropertyOptional({ example: 100000 })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 3,
    },
    { message: 'PRICE_IS_NUMBER' },
  )
  @Min(0, { message: 'PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0' })
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ example: 'chuyến xe lúc 5h sài gòn - đà lạt' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: 'd0adc2a4-386a-45de-bbf3-46d672b0a493' })
  @IsString({ message: 'TICKET_GROUP_ID_IS_STRING' })
  @IsOptional()
  ticketGroupId: string;

  @ApiPropertyOptional({ example: 'BGT32023' })
  @IsString({ message: 'TICKET_CODE_IS_STRING' })
  @IsOptional()
  ticketGroupCode: string;
}
