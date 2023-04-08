import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderUpdateStatusAdminEnum } from '../../../enums';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderForAdminDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: OrderUpdateStatusAdminEnum.CANCEL,
    enum: [
      '',
      OrderUpdateStatusAdminEnum.UNPAID,
      OrderUpdateStatusAdminEnum.PAID,
      OrderUpdateStatusAdminEnum.CANCEL,
      OrderUpdateStatusAdminEnum.RETURNED,
    ],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(
    [
      '',
      OrderUpdateStatusAdminEnum.UNPAID,
      OrderUpdateStatusAdminEnum.PAID,
      OrderUpdateStatusAdminEnum.CANCEL,
      OrderUpdateStatusAdminEnum.RETURNED,
    ],
    {
      message: 'ORDER_STATUS_IS_ENUM',
    },
  )
  @IsOptional()
  status: OrderUpdateStatusAdminEnum;
}
