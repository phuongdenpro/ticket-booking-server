import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMultiPromotionLineDto {
  @ApiProperty({
    example: [''],
    type: [String],
    description: 'List id/code',
  })
  @ArrayNotEmpty()
  @IsString({ each: true, message: 'LIST_ITEM_IS_STRING' })
  @IsArray({ message: 'LIST_IS_ARRAY' })
  readonly list: string[];
}
