import { ProvinceTypeEnum } from './../../../../enums/province-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveProvinceDto {
  @ApiProperty({ example: 'Thành phố Hà Nội' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_LENGTH' })
  name: string;

  @ApiProperty({
    example: ProvinceTypeEnum.MUNICIPALITY,
    enum: ProvinceTypeEnum,
  })
  @IsNotEmpty({ message: 'PROVINCE_TYPE_IS_REQUIRED' })
  @IsString({ message: 'PROVINCE_TYPE_IS_STRING' })
  @Length(1, 50, { message: 'PROVINCE_TYPE_BETWEEN_1_50_CHARACTERS' })
  type: ProvinceTypeEnum;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'CODENAME_IS_REQUIRED' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'CODE_IS_NUMBER' },
  )
  code: number;

  @ApiProperty({ example: 'thanh_pho_ha_noi' })
  @IsNotEmpty({ message: 'CODENAME_IS_REQUIRED' })
  @IsString({ message: 'CODENAME_IS_STRING' })
  @Length(1, 255, { message: 'CODENAME_BETWEEN_1_255_CHARACTERS' })
  codename: string;
}
