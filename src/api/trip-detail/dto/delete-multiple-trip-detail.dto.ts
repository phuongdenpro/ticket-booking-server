import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class TripDetailDeleteMultiInput {
  @ApiProperty({
    example: ['', '', ''],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  public ids: string[];
}
