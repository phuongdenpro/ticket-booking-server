import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeletePriceListDto {
  @ApiProperty({
    example: ['1', '2'],
    description: 'list id/code',
    type: [String],
    minLength: 1,
    isArray: true,
  })
  @IsArray()
  public ids: string[];
}
