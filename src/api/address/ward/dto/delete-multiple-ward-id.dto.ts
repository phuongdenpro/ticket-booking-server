import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class WardDeleteMultiCode {
  @ApiProperty({
    example: [12121212],
    description: 'list code',
    type: Array<number>,
  })
  @IsArray()
  public codes: number[];
}
