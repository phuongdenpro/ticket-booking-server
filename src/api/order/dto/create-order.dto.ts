import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: '09276ef0-df78-4ee1-9b4d-a0a1bd7ccbc6' })
  @IsNotEmpty({ message: 'CUSTOMER_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_ID_MUST_BE_36_CHARACTERS' })
  customerId: string;

  @ApiPropertyOptional({
    example: [
      '7b1e022a-96da-47c5-85b6-81858fd0f601',
      '7b1e022a-96da-47c5-85b6-81858fd0f602',
    ],
  })
  @IsArray({ message: 'SEAT_IDS_IS_ARRAY' })
  @IsOptional()
  seatIds: string[];

  @ApiPropertyOptional({ example: ['XGNL2A2', 'XGNL2A3'] })
  @IsArray({ message: 'SEAT_CODES_IS_ARRAY' })
  @IsOptional()
  seatCodes: string[];

  @ApiProperty({ example: 'GGGG' })
  @IsNotEmpty({ message: 'TRIP_DETAIL_CODE_REQUIRED' })
  @IsString({ message: 'TRIP_DETAIL_CODE_IS_STRING' })
  @Length(1, 100, { message: 'TRIP_DETAIL_CODE_BETWEEN_1_AND_100_CHARACTERS' })
  tripDetailCode: string;

  @ApiPropertyOptional({ example: ['', ''] })
  @IsArray({ message: 'PROMOTION_LINE_CODES_IS_ARRAY' })
  @IsString({ each: true, message: 'PROMOTION_LINE_CODES_IS_STRING' })
  @IsOptional()
  promotionLineCodes: string[];
}
