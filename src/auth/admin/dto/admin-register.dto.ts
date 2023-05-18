import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from './../../../enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({ example: 'dangdan2807+1@gmail.com' })
  @IsNotEmpty({ message: 'EMAIL_IS_REQUIRED' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @MinLength(6, { message: 'EMAIL_LENGTH' })
  @MaxLength(100, { message: 'EMAIL_LENGTH' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MinLength(6, { message: 'PASSWORD_IS_MIN_LENGTH_6' })
  password: string;

  @ApiProperty({ example: 'Dan 2' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '0354043344' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: GenderEnum.FEMALE, enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}
