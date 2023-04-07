import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderUpdateStatusEnum } from '../../../enums';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: OrderUpdateStatusEnum.CANCEL,
    enum: ['', OrderUpdateStatusEnum.CANCEL, OrderUpdateStatusEnum.RETURNED],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(['', OrderUpdateStatusEnum.CANCEL, OrderUpdateStatusEnum.RETURNED], {
    message: 'ORDER_STATUS_IS_ENUM',
  })
  @IsOptional()
  status: OrderUpdateStatusEnum;
}
