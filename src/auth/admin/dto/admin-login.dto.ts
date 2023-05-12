import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class AdminLoginDto {
  @ApiPropertyOptional({ example: 'dangdan2807@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: '0389324159' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MinLength(6, { message: 'PASSWORD_IS_MIN_LENGTH_6' })
  password: string;
}
