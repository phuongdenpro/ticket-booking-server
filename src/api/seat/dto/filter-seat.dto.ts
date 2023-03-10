import { SeatTypeEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class FilterSeatDto {
  @ApiPropertyOptional({ example: 'A1' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({ example: SeatTypeEnum.NON_SALES, enum: SeatTypeEnum })
  @IsString({ message: 'SEAT_TYPE_IS_STRING' })
  @IsEnum(SeatTypeEnum, { message: 'SEAT_TYPE_IS_ENUM' })
  @IsOptional()
  type: SeatTypeEnum;

  @ApiPropertyOptional({ example: 1, enum: [1, 2] })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    { message: 'FLOOR_IS_NUMBER' },
  )
  @Min(1, { message: 'SEAT_FLOOR_MIN_MAX' })
  @Max(2, { message: 'SEAT_FLOOR_MIN_MAX' })
  @IsEnum([1, 2], { message: 'SEAT_FLOOR_MIN_MAX' })
  @IsOptional()
  floor: number;
}
