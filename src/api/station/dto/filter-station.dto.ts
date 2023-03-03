import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SortEnum } from './../../../enums';

export class FilterStationDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsOptional()
  sort: SortEnum;
}
