import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterStationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keywords: string;
}
