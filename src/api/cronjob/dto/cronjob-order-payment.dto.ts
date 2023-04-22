import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CronjobOrderPaymentDto {
  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: 'SECRET_KEY_MUST_BE_REQUIRED' })
  @IsString({ message: 'SECRET_KEY_MUST_BE_STRING' })
  secretKey: string;
}
