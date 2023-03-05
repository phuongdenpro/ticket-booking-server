import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'dangdan2807@gmail.com' })
  @IsNotEmpty({ message: 'EMAIL_IS_REQUIRED' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @MinLength(6, { message: 'EMAIL_LENGTH' })
  @MaxLength(100, { message: 'EMAIL_LENGTH' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
