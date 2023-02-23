import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DistrictDeleteMultiCode {
  @ApiProperty({
    example: [1000],
    description: 'list code',
    type: Array<number>,
  })
  @IsArray()
  @IsNotEmpty({ message: 'CODES_IS_REQUIRED' })
  public codes: number[];
}
