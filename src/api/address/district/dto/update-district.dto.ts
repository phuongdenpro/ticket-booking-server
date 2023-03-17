import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDistrictDto {
  @ApiPropertyOptional({ example: 'Huyện Đông Anh' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'huyện' })
  @IsOptional()
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'huyen_dong_anh' })
  @IsOptional()
  @IsString()
  codename: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  provinceCode: number;
}
