import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderUpdateStatusCustomerEnum } from '../../../enums';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: OrderUpdateStatusCustomerEnum.CANCEL,
    enum: [
      '',
      OrderUpdateStatusCustomerEnum.CANCEL,
      OrderUpdateStatusCustomerEnum.RETURNED,
    ],
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(
    [
      '',
      OrderUpdateStatusCustomerEnum.CANCEL,
      OrderUpdateStatusCustomerEnum.RETURNED,
    ],
    {
      message: 'ORDER_STATUS_IS_ENUM',
    },
  )
  @IsOptional()
  status: OrderUpdateStatusCustomerEnum;
}
