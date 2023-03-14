import { ActiveStatusEnum, SortEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';

export class FilterPriceListDto {
  @ApiPropertyOptional({ example: 'Bảng giá tháng 3/2023' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({ example: '2023-03-01' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-03-15' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({
    example: ActiveStatusEnum.ACTIVE,
    enum: ['', ActiveStatusEnum.ACTIVE, ActiveStatusEnum.INACTIVE],
  })
  @IsString({ message: 'PRICE_LIST_STATUS_IS_STRING' })
  @IsEnum(ActiveStatusEnum, { message: 'PRICE_LIST_STATUS_INVALID' })
  @IsOptional()
  status: ActiveStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;
}
