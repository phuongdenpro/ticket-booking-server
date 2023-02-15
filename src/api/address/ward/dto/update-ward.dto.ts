import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateWardDto {
  @ApiPropertyOptional({ example: 'Thị trấn Đông Anh' })
  @IsString({ message: 'Name is string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'thị trấn' })
  @IsString({ message: 'Type is string' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ example: 454 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Code is number' },
  )
  code: number;

  @ApiPropertyOptional({ example: 'thi_tran_dong_anh' })
  @IsOptional()
  @IsString({ message: 'code name is string' })
  codename: string;

  @ApiPropertyOptional({ example: 17 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'district code is number' },
  )
  districtCode: number;
}
