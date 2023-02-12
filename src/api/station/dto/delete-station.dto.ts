import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class StationDeleteInput {
  @ApiProperty({
    description: 'list id',
    type: Array<String>,
  })
  @IsArray()
  public ids: string[];
}
