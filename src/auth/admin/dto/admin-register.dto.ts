import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from 'src/enums';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({ example: 'dangdan2807+1@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dan 2' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '0354043344' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: GenderEnum.FEMALE })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}
