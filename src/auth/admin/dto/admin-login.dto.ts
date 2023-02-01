import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'dangdan2807@gmail.com' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
