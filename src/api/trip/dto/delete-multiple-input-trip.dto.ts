import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class TripDeleteMultiInput {
  @ApiProperty({
    example: [
      '3f8a967b-d18c-4e9c-a074-0df589610452',
      'e01b0dc1-f057-4496-b2e3-c5b2075cfd74',
      'f0b54e9d-a1bc-4797-9c94-a2f416515719',
    ],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  public ids: string[];
}
