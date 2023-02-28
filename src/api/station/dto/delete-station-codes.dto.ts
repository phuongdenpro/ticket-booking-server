import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteStationByCodesDto {
  @ApiProperty({
    example: ['1', '2'],
    description: 'list code',
    type: [String],
    minLength: 1,
    isArray: true,
  })
  @IsArray()
  public codes: string[];
}
