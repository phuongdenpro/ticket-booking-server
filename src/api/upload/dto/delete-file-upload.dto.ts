import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFileUploadDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/dangdan2807/image/upload/v1676125893/n7uwgcsqef0fnjealy4o.webp',
  })
  @IsNotEmpty({ message: 'path is required' })
  @IsString({ message: 'path is string' })
  path: string;
}
