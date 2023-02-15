import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveDistrictDto {
  @ApiProperty({ example: 'Huyện Đông Anh' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'huyện' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  type: string;

  @ApiProperty({ example: 17 })
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiProperty({ example: 'huyen_dong_anh' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nameWithType: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  provinceCode: number;
}
