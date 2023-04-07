import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderCustomerSearch {
  @ApiProperty({
    description: 'search phone or email',
    type: 'string',
    required: false,
  })
  @IsNotEmpty({ message: 'KEYWORDS_IS_REQUIRED' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  key: string;
}
