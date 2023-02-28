import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterDistrictDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  name?: string;

  @ApiPropertyOptional({ example: 'huyen' })
  @IsOptional()
  @IsString({ message: 'DISTRICT_TYPE_IS_STRING' })
  type?: string;

  @ApiPropertyOptional({ example: 'thanh' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  codename?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'PROVINCE_CODE_IS_NUMBER' },
  )
  provinceCode?: number;
}
