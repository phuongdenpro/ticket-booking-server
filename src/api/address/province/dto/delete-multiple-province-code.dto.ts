import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ProvinceDeleteMultiId {
  @ApiProperty({
    example: [
      '009967e7-0cef-43cc-95bf-44942cf82711',
      '009967e7-0cef-43cc-95bf-44942cf82712',
    ],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  public ids: string[];
}
