import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class DeletePriceDetailDto {
  @ApiProperty({
    example: ['', ''],
    type: [String],
    description: 'List id/code',
  })
  @IsString({ each: true, message: 'LIST_ITEM_IS_STRING' })
  @ArrayNotEmpty()
  @IsArray({ message: 'LIST_IS_ARRAY' })
  public list: string[];
}
