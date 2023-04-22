import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class TopCustomerStatisticsDto {
  @ApiPropertyOptional({ enum: ['', 'week', 'month'], example: 'week' })
  @IsEnum(['', 'week', 'month'], {
    message: 'STATISTICS_TYPE_MUST_BE_WEEK_OR_MONTH',
  })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber({}, { message: 'LIMIT_MUST_BE_NUMBER' })
  @IsOptional()
  limit: number;
}
