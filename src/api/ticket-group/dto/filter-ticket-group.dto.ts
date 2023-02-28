import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortEnum } from './../../../enums/sort.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class FilterTicketGroupDto {
  @ApiPropertyOptional({ example: 'Chuyến Sài Gòn' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort: SortEnum;
}
