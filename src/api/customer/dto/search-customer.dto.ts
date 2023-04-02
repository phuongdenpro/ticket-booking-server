
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderCustomerSearch {
  @ApiProperty({
    description: 'search phone or email',
    type: 'string',
    required: false,
  })
  @IsOptional()
  key: string;
}



