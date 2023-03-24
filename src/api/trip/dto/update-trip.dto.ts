import { TripStatusEnum } from '../../../enums/trip-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'FROM_STATION_ID_IS_STRING' })
  @IsOptional()
  fromStationId: string;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'TO_STATION_ID_IS_STRING' })
  @IsOptional()
  toStationId: string;

  @ApiPropertyOptional({ example: 'd0adc2a4-386a-45de-bbf3-46d672b0a493' })
  @IsString({ message: 'TICKET_GROUP_ID_IS_STRING' })
  @IsOptional()
  ticketGroupId: string;

  @ApiPropertyOptional({ example: 'BGT32023' })
  @IsString({ message: 'TICKET_CODE_IS_STRING' })
  @IsOptional()
  ticketGroupCode: string;

  @ApiPropertyOptional({ example: TripStatusEnum.ACTIVE, enum: TripStatusEnum })
  @IsEnum(TripStatusEnum, { message: 'TRIP_STATUS_IS_ENUM' })
  @IsString({ message: 'TRIP_STATUS_IS_STRING' })
  @IsOptional()
  status: TripStatusEnum;
}
