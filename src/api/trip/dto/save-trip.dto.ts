import { TripStatusEnum } from '../../../enums/trip-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  Length,
  IsDate,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class SaveTripDto {
  @ApiProperty({ example: 'Bến xe miền đông - Bến xe Đức Long Bảo Lộc' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiPropertyOptional({
    example:
      'Từ Hồ Chí Minh đi Bến xe Đức Long Bảo Lộc xuất phát từ 5h chiều hằng ngày',
  })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: '2023-02-12' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  startDate: Date;

  @ApiPropertyOptional({ example: '2024-02-15T02:37:29.450Z' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'FROM_STATION_ID_IS_REQUIRED' })
  @IsNotEmpty({ message: 'FROM_STATION_ID_IS_REQUIRED' })
  @Length(36, 36, { message: 'FROM_STATION_ID_IS_36_CHARACTERS' })
  fromStationId: string;

  @ApiProperty({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'TO_STATION_ID_IS_STRING' })
  @IsNotEmpty({ message: 'TO_STATION_ID_IS_REQUIRED' })
  @Length(36, 36, { message: 'TO_STATION_ID_IS_36_CHARACTERS' })
  toStationId: string;

  @ApiPropertyOptional({ example: TripStatusEnum.ACTIVE, enum: TripStatusEnum })
  @IsEnum(TripStatusEnum, { message: 'TRIP_IS_ACTIVE_IS_ACTIVE_IS_ENUM' })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1)
  @IsOptional()
  isActive: TripStatusEnum;
}
