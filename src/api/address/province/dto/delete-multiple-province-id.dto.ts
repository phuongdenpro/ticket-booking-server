import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ProvinceDeleteMultiCode {
  @ApiProperty({
    example: [5811111, 5811112],
    description: 'list code',
    type: Array<number>,
  })
  @IsArray()
  public codes: number[];
}
