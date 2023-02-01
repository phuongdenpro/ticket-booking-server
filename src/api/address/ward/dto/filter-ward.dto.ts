import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterWardDto {
  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'phuong' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString()
  nameWithType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  districtCode?: number;
}
