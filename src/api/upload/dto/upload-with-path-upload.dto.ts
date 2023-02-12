import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadWithPathUploadDto {
  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
  })
  @IsNotEmpty({ message: 'path is required' })
  @IsString({ message: 'path is string' })
  path: string;
}
