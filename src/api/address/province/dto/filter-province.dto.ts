import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class FilterProvinceDto {
  @ApiPropertyOptional({ example: 'ha' })
  @IsOptional()
  @IsString({ message: 'name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'tinh' })
  @IsOptional()
  @IsString({ message: 'type is string' })
  @Length(1, 50, { message: 'type must be between 1 and 50 characters' })
  type?: string;

  @ApiPropertyOptional({ example: 'khanh' })
  @IsOptional()
  @IsString({ message: 'code name is string' })
  @Length(1, 255, { message: 'code name must be between 1 and 255 characters' })
  codename?: string;
}
