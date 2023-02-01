import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProvinceDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'tinh' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'khanh' })
  @IsOptional()
  @IsString()
  nameWithType?: string;
}
