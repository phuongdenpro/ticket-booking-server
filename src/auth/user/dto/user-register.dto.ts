import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from 'src/enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserRegisterDto {
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

  @ApiProperty({ example: GenderEnum.NONE })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum.NONE;
}
