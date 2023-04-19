import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import * as moment from 'moment';

export class TicketStatisticsDto {
  @ApiPropertyOptional({
    example: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({
    example: moment().format('YYYY-MM-DD'),
  })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber({}, { message: 'LIMIT_MUST_BE_NUMBER' })
  @IsOptional()
  limit: number;
}
