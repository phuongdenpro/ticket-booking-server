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
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiProperty({ example: 'huyen_dong_anh' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  codename: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  provinceCode: number;
}
