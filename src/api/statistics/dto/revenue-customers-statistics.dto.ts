import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class RevenueStatisticsDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'KEYWORD_MUST_BE_STRING' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({
    example: moment().startOf('days').subtract(7, 'days').toDate(),
  })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({
    example: moment().startOf('days').toDate(),
  })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;
}
