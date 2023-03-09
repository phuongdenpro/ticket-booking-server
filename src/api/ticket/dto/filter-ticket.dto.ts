import { SortEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class FilterTicketDto {
  @ApiPropertyOptional({ example: '1' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({ example: '2023-03-01' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2023-03-31' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsOptional()
  sort: SortEnum;
}
