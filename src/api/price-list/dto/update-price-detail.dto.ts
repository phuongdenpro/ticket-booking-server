import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsNumber, Min } from 'class-validator';

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

  @ApiProperty({ example: '1fbaba64-77c4-4403-9d14-73c03e3d0954' })
  @IsString({ message: 'PRICE_LIST_ID_IS_STRING' })
  @Length(36, 36, { message: 'PRICE_LIST_ID_IS_36_CHARACTERS' })
  @IsOptional()
  priceListId: string;

  @ApiProperty({ example: 'd0adc2a4-386a-45de-bbf3-46d672b0a493' })
  @IsString({ message: 'TICKET_GROUP_ID_IS_STRING' })
  @Length(36, 36, { message: 'TICKET_GROUP_ID_IS_36_CHARACTERS' })
  @IsOptional()
  ticketGroupId: string;
}
