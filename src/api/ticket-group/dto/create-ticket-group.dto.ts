import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateTicketGroupDto {
  @ApiProperty({ example: 'SGDL' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 'Chuyến Sài Gòn - Đà Lạt' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiProperty({ example: 'Nhóm vé của các chuyến Sài Gòn - Đà Lạt' })
  @IsNotEmpty({ message: 'DESCRIPTION_IS_REQUIRED' })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @Length(1, 1000, { message: 'DESCRIPTION_BETWEEN_1_1000_CHARACTERS' })
  description: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(0, 1000, { message: 'NOTE_BETWEEN_1_1000_CHARACTERS' })
  @IsOptional()
  note: string;
}
