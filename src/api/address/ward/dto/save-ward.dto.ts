import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveWardDto {
  @ApiPropertyOptional({ example: 'Thị trấn Đông Anh' })
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: 'thị trấn' })
  @IsNotEmpty({ message: 'Type is required' })
  @IsString({ message: 'Type is string' })
  @Length(1, 50, { message: 'Type must be between 1 and 50 characters' })
  type: string;

  @ApiPropertyOptional({ example: 454 })
  @IsNotEmpty({ message: 'Code is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Code is number' },
  )
  code: number;

  @ApiPropertyOptional({ example: 'thi_tran_dong_anh' })
  @IsNotEmpty({ message: 'code name is require' })
  @IsString({ message: 'code name is string' })
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  codename: string;

  @ApiPropertyOptional({ example: 17 })
  @IsNotEmpty({ message: 'district code is require' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'district code is number' },
  )
  districtCode: number;
}
