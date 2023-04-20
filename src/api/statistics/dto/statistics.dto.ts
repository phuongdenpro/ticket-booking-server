import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class StatisticsDto {
  @ApiPropertyOptional({ enum: ['', 'week', 'month'], example: 'week' })
  @IsEnum(['', 'week', 'month'], {
    message: 'STATISTICS_TYPE_MUST_BE_WEEK_OR_MONTH',
  })
  @IsOptional()
  type: string;
}
