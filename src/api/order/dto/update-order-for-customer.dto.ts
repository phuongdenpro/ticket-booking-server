import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../../enums';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: OrderStatusEnum.UNPAID,
    enum: ['', OrderStatusEnum.CANCEL, OrderStatusEnum.RETURNED],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(['', OrderStatusEnum.CANCEL, OrderStatusEnum.RETURNED], {
    message: 'ORDER_STATUS_IS_ENUM',
  })
  @IsOptional()
  status: OrderStatusEnum;
}
