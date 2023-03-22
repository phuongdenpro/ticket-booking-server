import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePriceDetailDto {
  @ApiProperty({ example: 'BGT32023' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 100000 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'PRICE_IS_NUMBER' },
  )
  @Min(0, { message: 'PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0' })
  price: number;

  @ApiPropertyOptional({ example: 'chuyến xe lúc 5h sài gòn - đà lạt' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: '1fbaba64-77c4-4403-9d14-73c03e3d0954' })
  @IsString({ message: 'PRICE_LIST_ID_IS_STRING' })
  @IsOptional()
  priceListId: string;

  @ApiProperty({ example: '1fbaba64-77c4-4403-9d14-73c03e3d0954' })
  @IsString({ message: 'PRICE_LIST_ID_IS_STRING' })
  @IsOptional()
  priceListCode: string;

  @ApiPropertyOptional({ example: 'd0adc2a4-386a-45de-bbf3-46d672b0a493' })
  @IsString({ message: 'TICKET_GROUP_ID_IS_STRING' })
  @IsOptional()
  ticketGroupId: string;

  @ApiPropertyOptional({ example: 'BGT32023' })
  @IsString({ message: 'TICKET_GROUP_CODE_IS_STRING' })
  @IsOptional()
  ticketGroupCode: string;

  @ApiPropertyOptional({ example: 'd0adc2a4-386a-45de-bbf3-46d672b0a493' })
  @IsString({ message: 'TRIP_ID_IS_STRING' })
  @IsOptional()
  tripId: string;

  @ApiPropertyOptional({ example: 'BGT32023' })
  @IsString({ message: 'TRIP_CODE_IS_STRING' })
  @IsOptional()
  tripCode: string;
}
