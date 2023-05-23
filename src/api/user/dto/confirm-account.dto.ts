import { ActiveOtpTypeEnum } from './../../../enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ConfirmAccountDto {
  @ApiPropertyOptional({ example: '09xxxxxxxx' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @IsOptional()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'OTP_IS_STRING' })
  @IsNotEmpty({ message: 'OTP_IS_REQUIRED' })
  otp: string;

  @ApiProperty({ example: ActiveOtpTypeEnum.ACTIVE })
  @IsNotEmpty({ message: 'OTP_TYPE_IS_REQUIRED' })
  @IsEnum(ActiveOtpTypeEnum, { message: 'INVALID_OTP_TYPE' })
  type: ActiveOtpTypeEnum;
}
