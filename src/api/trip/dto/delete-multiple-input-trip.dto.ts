import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class TripDeleteMultiInput {
  @ApiProperty({
    example: ['idOrCode1', 'idOrCode2', 'idOrCode3'],
    description: 'list id/code',
    type: [String],
  })
  @IsArray()
  public ids: string[];
}
