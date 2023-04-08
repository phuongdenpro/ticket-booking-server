import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({ example: '123456789' })
  orderCode: string;

  paymentMethod: string;

  // paymentAmount: number;
}
