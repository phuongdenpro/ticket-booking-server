import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiPropertyOptional({ example: '09xxxxxxxx' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsOptional()
  email: string;
}
