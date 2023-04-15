import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderRefundStatusEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderRefundDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: [OrderRefundStatusEnum.PENDING, OrderRefundStatusEnum.FINISHED],
    enum: ['', OrderRefundStatusEnum.PENDING, OrderRefundStatusEnum.FINISHED],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(['', OrderRefundStatusEnum.PENDING, OrderRefundStatusEnum.FINISHED], {
    message: 'ORDER_REFUND_STATUS_IS_ENUM',
  })
  @IsOptional()
  status: OrderRefundStatusEnum;
}
