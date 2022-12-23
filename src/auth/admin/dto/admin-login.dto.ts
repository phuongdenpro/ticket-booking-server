import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'phuongadmin' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
