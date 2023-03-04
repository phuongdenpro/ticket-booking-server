import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @ApiPropertyOptional({ example: '0354043345' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'dangdan28075@gmail.com' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
