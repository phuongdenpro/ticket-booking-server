import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class FilterTripDto {
  @ApiPropertyOptional({
    example: 'Bến xe miền đông - Bến xe Đức Long Bảo Lộc',
  })
  @IsString({ message: 'Name is string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '2023-02-15' })
  @IsOptional()
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ example: '2024-02-15T02:37:29.450Z' })
  @IsDate({ message: 'End date is date' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: '2023-02-15T02:37:29.450Z' })
  @IsOptional()
  @IsDate()
  departureTime: Date;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'From Station Id is string' })
  @IsOptional()
  fromStationId: string;

  @ApiPropertyOptional({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'To Station Id is string' })
  @IsOptional()
  toStationId: string;
}
