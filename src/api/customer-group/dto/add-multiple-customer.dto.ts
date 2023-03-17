import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class AddMultiCustomerDto {
  @ApiProperty({
    example: [
      '958a39f4-f52a-412d-9042-3acb3590e210',
      '958a39f4-f52a-412d-9042-3acb3590e2c9',
    ],
    description: 'list customer id',
    type: Array<string>,
  })
  @IsNotEmpty({ message: 'CUSTOMER_ID_IS_REQUIRED' })
  @IsArray({ message: 'CUSTOMER_ID_IS_ARRAY' })
  public customerIds: string[];

  @ApiProperty({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  @IsNotEmpty({ message: 'CUSTOMER_GROUP_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_GROUP_ID_MUST_BE_36_CHARACTERS' })
  customerGroupId: string;
}
