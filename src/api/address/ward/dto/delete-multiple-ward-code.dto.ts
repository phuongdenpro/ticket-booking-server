import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class WardDeleteMultiId {
  @ApiProperty({
    example: [10606],
    description: 'list id',
    type: Array<number>,
  })
  @IsArray()
  public ids: number[];
}
