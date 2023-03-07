import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'FROM_STATION_ID_IS_STRING' })
  @IsOptional()
  fromStationId: string;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'TO_STATION_ID_IS_STRING' })
  @IsOptional()
  toStationId: string;
}
