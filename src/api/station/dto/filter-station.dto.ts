import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterStationDto {
  @ApiPropertyOptional({ example: 'can tho' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ninh kieu' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 9266 })
  @IsOptional()
  @IsNumber()
  wardId?: number;
}
