import { OrderStatusEnum, SortEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterOrderDto {
  @ApiPropertyOptional({ example: 'Bảng giá tháng 3/2023' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({
    example: OrderStatusEnum.PAID,
    enum: [
      '',
      OrderStatusEnum.PAID,
      OrderStatusEnum.UNPAID,
      OrderStatusEnum.CANCEL,
      OrderStatusEnum.PENDING_RETURN,
      OrderStatusEnum.RETURNED,
    ],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(
    [
      '',
      OrderStatusEnum.PAID,
      OrderStatusEnum.UNPAID,
      OrderStatusEnum.CANCEL,
      OrderStatusEnum.PENDING_RETURN,
      OrderStatusEnum.RETURNED,
    ],
    { message: 'ORDER_STATUS_IS_ENUM' },
  )
  @IsOptional()
  status: OrderStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;
}
