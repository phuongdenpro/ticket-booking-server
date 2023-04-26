import { PaymentMethodEnum } from '../../../enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePaymentHistoryDto {
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @IsNumber({}, { message: 'AMOUNT_IS_NUMBER' })
  @IsOptional()
  amount: number;

  @IsEnum(PaymentMethodEnum, { message: 'PAYMENT_METHOD_IS_ENUM' })
  @IsOptional()
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty({ message: 'ZALO_TRANS_ID_REQUIRED' })
  @IsString({ message: 'ZALO_TRANS_ID_STRING' })
  zaloTransId: string;

  @IsNotEmpty({ message: 'PAYMENT_TIME_ID_REQUIRED' })
  @IsDate({ message: 'PAYMENT_TIME_IS_DATE' })
  paymentTime: Date;
}
