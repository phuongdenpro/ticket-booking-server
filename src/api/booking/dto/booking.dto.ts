import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateBookingDto {
  @ApiPropertyOptional({
    example: [
      '7b1e022a-96da-47c5-85b6-81858fd0f601',
      '7b1e022a-96da-47c5-85b6-81858fd0f602',
    ],
    type: [String],
  })
  @IsArray({ message: 'SEAT_IDS_IS_ARRAY' })
  @IsOptional()
  seatIds: string[];

  @ApiPropertyOptional({
    example: ['XGNL2A2', 'XGNL2A3'],
    type: [String],
  })
  @IsArray({ message: 'SEAT_CODES_IS_ARRAY' })
  @IsOptional()
  seatCodes: string[];

  @ApiProperty({ example: 'b87985ac-3b08-46bf-8e6f-02902dcaedaf' })
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
