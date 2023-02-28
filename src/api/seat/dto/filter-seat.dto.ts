import { SeatTypeEnum } from './../../../enums/seat-type.enum';
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
  @IsString({ message: 'NAME_IS_STRING' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: SeatTypeEnum.NON_SALES, enum: SeatTypeEnum })
  @IsOptional()
  @IsString({ message: 'SEAT_TYPE_IS_STRING' })
  @IsEnum(SeatTypeEnum, { message: 'SEAT_TYPE_IS_ENUM' })
  type: SeatTypeEnum;

  @ApiPropertyOptional({ example: 1, enum: [1, 2] })
  @IsOptional()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    { message: 'FLOOR_IS_NUMBER' },
  )
  @Min(1)
  @Max(2)
  floor: number;
}
