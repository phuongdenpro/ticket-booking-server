import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteMultiCustomerGroupDto {
  @ApiProperty({
    example: ['', ''],
    description: 'list customer group id / code',
    type: Array<string>,
  })
  @IsArray()
  @IsNotEmpty({ message: 'CUSTOMER_GROUP_ID_IS_REQUIRED' })
  public ids: string[];
}
