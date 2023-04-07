import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class DeletePriceDetailDto {
  @ApiProperty({
    example: ['idOrCode1', 'idOrCode2', 'idOrCode3'],
    description: 'list id/code',
    type: [String],
  })
  @IsString({ each: true, message: 'LIST_ITEM_IS_STRING' })
  @ArrayNotEmpty()
  @IsArray({ message: 'LIST_IS_ARRAY' })
  public list: string[];
}
