import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteStationByIdsDto {
  @ApiProperty({
    example: [
      '8d453086-e6a2-4a2e-a407-5ce2be3b0b01',
      '902c3808-afdb-4285-9de7-c47e4ce5d19c',
    ],
    description: 'list id',
    type: [String],
    minLength: 1,
    isArray: true,
  })
  @IsArray()
  public ids: string[];
}
