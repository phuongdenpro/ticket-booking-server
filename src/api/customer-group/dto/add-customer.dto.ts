import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AddCustomerDto {
  @ApiProperty({ example: '958a39f4-f52a-412d-9042-3acb3590e210' })
  @IsNotEmpty({ message: 'CUSTOMER_ID_IS_REQUIRED' })
  @IsString({ message: 'CUSTOMER_ID_IS_STRING' })
  @Length(36, 36, { message: 'CUSTOMER_ID_MUST_BE_36_CHARACTERS' })
  customerId: string;

  @ApiPropertyOptional({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @IsOptional()
  customerGroupId: string;

  @ApiPropertyOptional({ example: 'NKHCBD3' })
  @IsString({ message: 'CUSTOMER_GROUP_CODE_IS_STRING' })
  @IsOptional()
  customerGroupCode: string;
}
