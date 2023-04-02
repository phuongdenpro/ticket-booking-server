import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import * as moment from 'moment';
moment.locale('vi');

export class FilterAvailablePromotionLineDto {
  @ApiPropertyOptional({ example: moment().format('YYYY-MM-DD') })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({
    example: moment().add(10, 'days').format('YYYY-MM-DD'),
  })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  tripCode: string;
  minQuantityBuy: number;
  minPurchaseAmount: number;
}
