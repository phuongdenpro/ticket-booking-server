import { PaymentMethod } from './../../../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'ORDER_CODE_IS_REQUIRED' })
  @IsString({ message: 'ORDER_CODE_MUST_BE_STRING' })
  orderCode: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'PAYMENT_METHOD_IS_REQUIRED' })
  @IsEnum(PaymentMethod, { message: 'PAYMENT_METHOD_IS_ENUM' })
  paymentMethod: PaymentMethod;
}
