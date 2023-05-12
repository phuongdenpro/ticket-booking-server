import {
  PaymentHistoryStatusEnum,
  PaymentMethodEnum,
  UpdatePayHTypeDtoEnum,
} from '../../../enums';
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

  @IsEnum(PaymentHistoryStatusEnum, {
    message: 'PAYMENT_HISTORY_STATUS_IS_ENUM',
  })
  @IsOptional()
  status: PaymentHistoryStatusEnum;

  @IsEnum(PaymentMethodEnum, { message: 'PAYMENT_METHOD_IS_ENUM' })
  @IsOptional()
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty({ message: 'PAYMENT_HISTORY_TYPE_IS_REQUIRED' })
  @IsEnum(UpdatePayHTypeDtoEnum, { message: 'PAYMENT_HISTORY_TYPE_IS_ENUM' })
  type: UpdatePayHTypeDtoEnum;

  @IsString({ message: 'APP_TRANS_ID_STRING' })
  @IsOptional()
  transId: string;

  @IsNumber({}, { message: 'APP_TIME_MUST_BE_NUMBER' })
  @IsOptional()
  createAppTime: number;

  @IsString({ message: 'ZALO_TRANS_ID_STRING' })
  @IsOptional()
  zaloTransId: string;

  @IsDate({ message: 'PAYMENT_TIME_IS_DATE' })
  @IsOptional()
  paymentTime: Date;
}
