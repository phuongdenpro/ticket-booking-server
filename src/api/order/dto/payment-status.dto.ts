import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentStatusDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'ORDER_CODE_IS_REQUIRED' })
  @IsString({ message: 'ORDER_CODE_MUST_BE_STRING' })
  orderCode: string;

  appTransId: string;

  appTime: string;
}
