import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class HiddenStationDto {
  @ApiPropertyOptional({ example: 0, description: '1: hidden, 0: show' })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number;
}
