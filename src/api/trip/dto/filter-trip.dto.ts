import { SortEnum, ActiveStatusEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';

export class FilterTripDto {
  @ApiPropertyOptional({
    example: 'Bến xe miền đông - Bến xe Đức Long Bảo Lộc',
  })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({ example: '2023-02-15' })
  @IsDate({ message: 'TRIP_START_DATE_INVALID' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2024-02-15T02:37:29.450Z' })
  @IsDate({ message: 'TRIP_END_DATE_INVALID' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: 'MIN_TRAVEL_HOURS_IS_NUMBER' },
  )
  @IsOptional()
  minTravelHours: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: 'MAX_TRAVEL_HOURS_IS_NUMBER' },
  )
  @IsOptional()
  maxTravelHours: number;

  @ApiPropertyOptional({
    example: ActiveStatusEnum.ACTIVE,
    enum: ['', ActiveStatusEnum.ACTIVE, ActiveStatusEnum.INACTIVE],
  })
  @IsString({ message: 'TRIP_STATUS_IS_STRING' })
  @IsEnum(ActiveStatusEnum, { message: 'TRIP_STATUS_IS_ENUM' })
  @IsOptional()
  status: ActiveStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'FROM_STATION_ID_IS_STRING' })
  @IsOptional()
  fromStationId: string;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'TO_STATION_ID_IS_STRING' })
  @IsOptional()
  toStationId: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'FROM_STATION_CODE_IS_STRING' })
  @IsOptional()
  fromStationCode: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TO_STATION_CODE_IS_STRING' })
  @IsOptional()
  toStationCode: string;
}
