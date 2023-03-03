import { SortEnum } from '../../../enums/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterCustomerGroupDto {
  @ApiPropertyOptional({ example: 'cao cấp' })
  @IsOptional()
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  keywords?: string;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsOptional()
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort?: SortEnum;
}
