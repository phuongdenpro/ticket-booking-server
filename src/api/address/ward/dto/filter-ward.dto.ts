import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterWardDto {
  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  name?: string;

  @ApiPropertyOptional({ example: 'phuong' })
  @IsOptional()
  @IsString({ message: 'WARD_TYPE_IS_STRING' })
  type?: string;

  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  codename?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'DISTRICT_CODE_ID_NUMBER' },
  )
  districtCode?: number;
}
