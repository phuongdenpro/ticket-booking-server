import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerLoginDto {
  @ApiPropertyOptional({ example: '0354043345' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'dangdan28075@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @MinLength(6, { message: 'EMAIL_LENGTH' })
  @MaxLength(100, { message: 'EMAIL_LENGTH' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsOptional()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MinLength(6, { message: 'PASSWORD_IS_MIN_LENGTH_6' })
  @MaxLength(255, { message: 'PASSWORD_IS_MAX_LENGTH_255' })
  password: string;
}
