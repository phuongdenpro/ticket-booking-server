import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterDistrictDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'huyen' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'thanh' })
  @IsOptional()
  @IsString()
  nameWithType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  provinceCode?: number;
}
