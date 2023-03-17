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
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: '0389324159' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
