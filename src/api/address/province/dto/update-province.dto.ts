import { ProvinceTypeEnum } from './../../../../enums/province-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProvinceDto {
  @ApiPropertyOptional({ example: 'Thành phố Hà Nội' })
  @IsString({ message: 'NAME_IS_STRING' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: ProvinceTypeEnum.MUNICIPALITY,
    enum: ProvinceTypeEnum,
  })
  @IsOptional()
  @IsString({ message: 'PROVINCE_TYPE_IS_STRING' })
  type: ProvinceTypeEnum;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'CODE_IS_NUMBER' },
  )
  code: number;

  @ApiPropertyOptional({ example: 'thanh_pho_ha_noi' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  codename: string;
}
