import { PaymentHistoryStatusEnum, PaymentMethodEnum } from './../../../enums';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentHistoryDto {
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @IsEnum(PaymentHistoryStatusEnum, {
    message: 'PAYMENT_HISTORY_STATUS_IS_ENUM',
  })
  @IsOptional()
  status: PaymentHistoryStatusEnum;

  @IsNotEmpty({ message: 'AMOUNT_IS_NOT_EMPTY' })
  @IsNumber({}, { message: 'AMOUNT_IS_NUMBER' })
  amount: number;

  @IsNotEmpty({ message: 'ORDER_CODE_IS_REQUIRED' })
  @IsString({ message: 'ORDER_CODE_MUST_BE_STRING' })
  orderCode: string;

  @IsNotEmpty({ message: 'PAYMENT_METHOD_IS_REQUIRED' })
  @IsEnum(PaymentMethodEnum, { message: 'PAYMENT_METHOD_IS_ENUM' })
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty({ message: 'APP_TRANS_ID_REQUIRED' })
  @IsString({ message: 'APP_TRANS_ID_STRING' })
  transId: string;

  @IsNotEmpty({ message: 'APP_TIME_ID_REQUIRED' })
  @IsNumber({}, { message: 'APP_TIME_MUST_BE_NUMBER' })
  createAppTime: number;
}
