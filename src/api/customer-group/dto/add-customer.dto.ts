import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddCustomerDto {
  @ApiProperty({ example: '32489ff0-cb19-41c2-991c-53b98398f773' })
  @IsNotEmpty({ message: 'CUSTOMER_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_ID_MUST_BE_36_CHARACTERS' })
  customerId: string;

  @ApiProperty({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  @IsNotEmpty({ message: 'CUSTOMER_GROUP_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_GROUP_ID_MUST_BE_36_CHARACTERS' })
  customerGroupId: string;
}
