import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortEnum } from './../../../enums';

export class CountUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ example: 'shortName' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ example: SortEnum.ASC })
  @IsOptional()
  @IsEnum(SortEnum)
  sort?: SortEnum;
}
