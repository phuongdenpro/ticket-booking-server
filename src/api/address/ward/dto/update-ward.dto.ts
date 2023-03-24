import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateWardDto {
  @ApiPropertyOptional({ example: 'Thị trấn Đông Anh' })
  @IsString({ message: 'NAME_IS_STRING' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'thị trấn' })
  @IsString({ message: 'WARD_TYPE_IS_STRING' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ example: 'thi_tran_dong_anh' })
  @IsOptional()
  @IsString({ message: 'CODENAME_IS_STRING' })
  codename: string;

  @ApiPropertyOptional({ example: 17 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'DISTRICT_CODE_ID_NUMBER' },
  )
  districtCode: number;
}
