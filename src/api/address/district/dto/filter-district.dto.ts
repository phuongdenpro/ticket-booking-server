import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class FilterDistrictDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_LENGTH' })
  name?: string;

  @ApiPropertyOptional({ example: 'huyen' })
  @IsOptional()
  @IsString({ message: 'DISTRICT_TYPE_IS_STRING' })
  @Length(1, 50, { message: 'DISTRICT_TYPE_LENGTH' })
  type?: string;

  @ApiPropertyOptional({ example: 'thanh' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  @Length(1, 255, { message: 'CODENAME_BETWEEN_1_255_CHARACTERS' })
  codename?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'PROVINCE_CODE_IS_NUMBER' },
  )
  provinceCode?: number;
}
