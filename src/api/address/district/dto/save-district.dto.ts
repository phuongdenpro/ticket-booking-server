import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveDistrictDto {
  @ApiProperty({ example: 'Huyện Đông Anh' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiProperty({ example: 'huyện' })
  @IsNotEmpty({ message: 'DISTRICT_TYPE_REQUIRED' })
  @IsString({ message: 'DISTRICT_TYPE_IS_STRING' })
  @Length(1, 50, { message: 'DISTRICT_TYPE_LENGTH' })
  type: string;

  @ApiProperty({ example: 17 })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'CODE_IS_NUMBER' },
  )
  code: number;

  @ApiProperty({ example: 'huyen_dong_anh' })
  @IsNotEmpty({ message: 'CODENAME_IS_REQUIRED' })
  @IsString({ message: 'CODENAME_IS_STRING' })
  @Length(1, 255, { message: 'CODENAME_BETWEEN_1_255_CHARACTERS' })
  codename: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'PROVINCE_CODE_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'PROVINCE_CODE_IS_NUMBER' },
  )
  provinceCode: number;
}
