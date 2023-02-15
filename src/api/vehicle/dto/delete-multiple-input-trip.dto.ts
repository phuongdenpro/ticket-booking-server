import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class VehicleDeleteMultiInput {
  @ApiProperty({
    example: [
      '7b1e022a-96da-47c5-85b6-81858fd0f601',
      '7b1e022a-96da-47c5-85b6-81858fd0f602',
      '7b1e022a-96da-47c5-85b6-81858fd0f603',
    ],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  public ids: string[];
}
