import { ProvinceTypeEnum } from './../../../../enums/province-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class FilterProvinceDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiPropertyOptional({
    example: ProvinceTypeEnum.PROVINCE,
    enum: ProvinceTypeEnum,
  })
  @IsOptional()
  @Length(1, 50, { message: 'type must be between 1 and 50 characters' })
  @IsEnum(ProvinceTypeEnum)
  type: ProvinceTypeEnum;

  @ApiPropertyOptional({ example: 'khanh' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  @Length(1, 255, { message: 'CODENAME_BETWEEN_1_255_CHARACTERS' })
  codename?: string;
}
