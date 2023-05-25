import { ActiveStatusEnum } from '../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsNumber } from 'class-validator';

export class UpdateTripDto {
  @ApiPropertyOptional({
    example: 'Bến xe miền đông - Bến xe Đức Long Bảo Lộc',
  })
  @IsString({ message: 'NAME_IS_STRING' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example:
      'Từ Hồ Chí Minh đi Bến xe Đức Long Bảo Lộc xuất phát từ 5h chiều hằng ngày',
  })
  @IsOptional()
  @IsString({ message: 'NOTE_IS_STRING' })
  note: string;

  @ApiPropertyOptional({ example: '2023-02-12' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2024-02-15T02:37:29.450Z' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: 'TRAVEL_HOURS_IS_NUMBER' },
  )
  @IsOptional()
  travelHours: number;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'FROM_STATION_ID_IS_STRING' })
  @IsOptional()
  fromStationId: string;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'TO_STATION_ID_IS_STRING' })
  @IsOptional()
  toStationId: string;

  @ApiPropertyOptional({
    example: ActiveStatusEnum.ACTIVE,
    enum: ['', ActiveStatusEnum.ACTIVE, ActiveStatusEnum.INACTIVE],
  })
  @IsString({ message: 'TRIP_STATUS_IS_STRING' })
  @IsEnum(ActiveStatusEnum, { message: 'TRIP_STATUS_IS_ENUM' })
  @IsOptional()
  status: ActiveStatusEnum;
}
