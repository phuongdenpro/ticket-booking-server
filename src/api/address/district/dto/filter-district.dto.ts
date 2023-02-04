import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class FilterDistrictDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'huyen' })
  @IsOptional()
  @IsString({ message: 'type is string' })
  @Length(1, 50, { message: 'type must be between 1 and 50 characters' })
  type?: string;

  @ApiPropertyOptional({ example: 'thanh' })
  @IsOptional()
  @IsString({ message: 'code name is string' })
  @Length(1, 255, { message: 'code name must be between 1 and 255 characters' })
  codename?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'province code is number' },
  )
  provinceCode?: number;
}
