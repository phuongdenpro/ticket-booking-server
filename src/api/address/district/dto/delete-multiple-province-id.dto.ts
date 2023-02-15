import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DistrictDeleteMultiCode {
  @ApiProperty({
    example: [1000],
    description: 'list code',
    type: Array<number>,
  })
  @IsArray()
  public codes: number[];
}
