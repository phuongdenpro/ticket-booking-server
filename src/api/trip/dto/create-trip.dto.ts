import { ActiveStatusEnum } from './../../../enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  Length,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ example: 'MDBL' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

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

  @ApiProperty({ example: 5 })
  @IsNotEmpty({ message: 'TRAVEL_HOURS_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: 'TRAVEL_HOURS_IS_NUMBER' },
  )
  travelHours: number;

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

  @ApiPropertyOptional({
    example: ActiveStatusEnum.ACTIVE,
    enum: ['', ActiveStatusEnum.ACTIVE, ActiveStatusEnum.INACTIVE],
  })
  @IsEnum(['', ActiveStatusEnum.ACTIVE, ActiveStatusEnum.INACTIVE], {
    message: 'TRIP_STATUS_IS_ENUM',
  })
  @IsString({ message: 'TRIP_STATUS_IS_STRING' })
  @IsOptional()
  status: ActiveStatusEnum;
}
