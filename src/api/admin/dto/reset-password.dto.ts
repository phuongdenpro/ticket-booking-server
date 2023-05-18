import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminResetPasswordDto {
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

  // @ApiProperty({ example: '123456' })
  // @IsString({ message: 'OTP_IS_STRING' })
  // @IsNotEmpty({ message: 'OTP_IS_REQUIRED' })
  // otp: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'NEW_PASSWORD_REQUIRED' })
  @IsString({ message: 'NEW_PASSWORD_MUST_BE_STRING' })
  @MinLength(6, { message: 'NEW_PASSWORD_MIN_6_CHARACTERS' })
  newPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'CONFIRM_NEW_PASSWORD_REQUIRED' })
  @IsString({ message: 'CONFIRM_NEW_PASSWORD_MUST_BE_STRING' })
  @MinLength(6, { message: 'CONFIRM_NEW_PASSWORD_MIN_6_CHARACTERS' })
  confirmNewPassword: string;
}
