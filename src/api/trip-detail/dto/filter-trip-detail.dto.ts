import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { TripDetailStatusEnum } from './../../../enums';

export class FilterTripDetailDto {
  @ApiPropertyOptional({ example: '2023-02-12' })
  @IsOptional()
  @IsDate({ message: 'INVALID_DATE' })
  departureTime: Date;

  @ApiPropertyOptional({
    example: TripDetailStatusEnum.NOT_SOLD_OUT,
    enum: TripDetailStatusEnum,
  })
  @IsOptional()
  @IsString({ message: 'INVALID_STRING' })
  @IsEnum(TripDetailStatusEnum, { message: 'INVALID_TRIP_DETAIL_STATUS' })
  status: TripDetailStatusEnum;

  @ApiPropertyOptional({ example: '59464f9b-0be3-4929-b1ea-d2aa80c21a6a' })
  @IsOptional()
  @IsString({ message: 'TRIP_ID_IS_STRING' })
  tripId: string;

  @ApiPropertyOptional({ example: 79 })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    { message: 'FROM_PROVINCE_CODE_INVALID_NUMBER' },
  )
  @IsOptional()
  fromProvinceCode: number;

  @ApiPropertyOptional({ example: 68 })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    { message: 'TO_PROVINCE_CODE_INVALID_NUMBER' },
  )
  @IsOptional()
  toProvinceCode: number;
}
