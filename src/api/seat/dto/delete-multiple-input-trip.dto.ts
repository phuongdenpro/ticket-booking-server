import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class SeatDeleteMultiInput {
  @ApiProperty({
    example: [
      'd3a275cd-2bc8-45d3-818c-0686bc408019',
      '1f54d8b6-fb55-452a-a6f8-40604e92469e',
      '282d1668-485c-4a2a-bf4c-4e9d5420ad9c',
    ],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  public ids: string[];
}
