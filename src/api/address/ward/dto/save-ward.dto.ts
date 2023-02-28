import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveWardDto {
  @ApiPropertyOptional({ example: 'Thị trấn Đông Anh' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  name: string;

  @ApiPropertyOptional({ example: 'thị trấn' })
  @IsNotEmpty({ message: 'WARD_TYPE_IS_REQUIRED' })
  @IsString({ message: 'WARD_TYPE_IS_STRING' })
  @Length(1, 50, { message: 'WARD_TYPE_BETWEEN_1_50_CHARACTERS' })
  type: string;

  @ApiPropertyOptional({ example: 454 })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'CODE_IS_NUMBER' },
  )
  code: number;

  @ApiPropertyOptional({ example: 'thi_tran_dong_anh' })
  @IsNotEmpty({ message: 'CODENAME_IS_REQUIRED' })
  @IsString({ message: 'CODENAME_IS_STRING' })
  @Length(1, 255, { message: 'CODENAME_BETWEEN_1_255_CHARACTERS' })
  codename: string;

  @ApiPropertyOptional({ example: 17 })
  @IsNotEmpty({ message: 'DISTRICT_CODE_ID_REQUIRED' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'DISTRICT_CODE_ID_NUMBER' },
  )
  districtCode: number;
}
