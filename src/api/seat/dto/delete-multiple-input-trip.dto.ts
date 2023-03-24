import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class SeatDeleteMultiInput {
  @ApiProperty({
    example: ['', ''],
    description: 'list id/code',
    type: Array<string>,
  })
  @IsArray()
  public data: string[];
}
