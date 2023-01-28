import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class HiddenProvinceDto {
  @ApiPropertyOptional({ example: 0 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number;
}
