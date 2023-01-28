import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from 'src/enums';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '0354043344' })
  @IsString()
  @IsEmpty()
  phone?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum.NONE;
}
