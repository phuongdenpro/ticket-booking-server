import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProvinceDto {
  @ApiPropertyOptional({ example: 'Thành phố Hà Nội' })
  @IsString({ message: 'Name is string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'thành phố trung ương' })
  @IsOptional()
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'code is number' },
  )
  code: number;

  @ApiPropertyOptional({ example: 'thanh_pho_ha_noi' })
  @IsOptional()
  @IsString({ message: 'code name is string' })
  codename: string;
}
