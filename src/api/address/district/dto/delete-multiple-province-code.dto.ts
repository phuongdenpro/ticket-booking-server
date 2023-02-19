import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DistrictDeleteMultiId {
  @ApiProperty({
    example: ['34b03a8c-76b5-4053-b1af-571e5dece90a'],
    description: 'list id',
    type: Array<string>,
  })
  @IsArray()
  @IsNotEmpty({ message: 'IDS_REQUIRE' })
  public ids: string[];
}
