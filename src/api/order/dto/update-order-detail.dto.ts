import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderDetailDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: '7b1e022a-96da-47c5-85b6-81858fd0f601' })
  @IsString({ message: 'SEAT_ID_IS_STRING' })
  @IsOptional()
  seatId: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'SEAT_CODE_IS_STRING' })
  @IsOptional()
  seatCode: string;
}
