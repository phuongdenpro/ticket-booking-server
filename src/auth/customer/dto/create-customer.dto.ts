import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '../../../enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'superman' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @IsDate()
  birthday?: Date;

  @ApiProperty({ example: '0354043344' })
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @ApiProperty({ example: GenderEnum.NONE, enum: GenderEnum })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum.NONE;
}
