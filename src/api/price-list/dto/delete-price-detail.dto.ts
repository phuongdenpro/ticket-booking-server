import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeletePriceDetailDto {
  @ApiProperty({
    example: ['1', '2'],
    description: 'list id',
    type: [String],
    minLength: 1,
    isArray: true,
  })
  @IsArray()
  public ids: string[];
}
