import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '../../../enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MinLength(6, { message: 'PASSWORD_IS_MIN_LENGTH_6' })
  @MaxLength(255, { message: 'PASSWORD_IS_MAX_LENGTH_255' })
  password: string;

  @ApiProperty({ example: 'superman' })
  @IsNotEmpty({ message: 'FULL_NAME_IS_REQUIRED' })
  @IsString({ message: 'FULL_NAME_IS_STRING' })
  fullName: string;

  @ApiPropertyOptional({ example: new Date(`${new Date().toDateString()}`) })
  @IsDate({ message: 'BIRTHDAY_IS_DATE' })
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ example: '0354043344' })
  @IsNotEmpty({ message: 'PHONE_IS_REQUIRED' })
  @IsString({ message: 'PHONE_IS_STRING' })
  phone: string;

  @ApiPropertyOptional({ example: GenderEnum.OTHER, enum: GenderEnum })
  @IsEnum(GenderEnum, { message: 'GENDER_IS_ENUM' })
  @IsOptional()
  gender?: GenderEnum;
}
