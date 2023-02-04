import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class FilterWardDto {
  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString({ message: 'name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'phuong' })
  @IsOptional()
  @IsString({ message: 'type is string' })
  @Length(1, 50, { message: 'type must be between 1 and 50 characters' })
  type?: string;

  @ApiPropertyOptional({ example: 'phuc' })
  @IsOptional()
  @IsString({ message: 'code name is string' })
  @Length(1, 255, { message: 'code name must be between 1 and 255 characters' })
  codename?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'district code is number' },
  )
  districtCode?: number;
}
