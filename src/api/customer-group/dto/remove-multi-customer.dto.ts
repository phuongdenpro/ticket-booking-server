import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class RemoveMultiCustomerDto {
  @ApiProperty({
    example: [
      '32489ff0-cb19-41c2-991c-53b98398f773',
      '9a1f6cda-415f-4431-89f3-3d21d75cbacd',
    ],
    description: 'list customer id',
    type: Array<string>,
  })
  @IsArray()
  @IsNotEmpty({ message: 'CUSTOMER_ID_IS_REQUIRED' })
  customerIds: string[];

  @ApiProperty({ example: '2a5147d9-8449-4fca-83c0-e3fa29af596d' })
  @IsNotEmpty({ message: 'CUSTOMER_GROUP_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_GROUP_ID_MUST_BE_36_CHARACTERS' })
  customerGroupId: string;
}
