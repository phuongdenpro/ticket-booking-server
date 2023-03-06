import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class SaveCustomerGroupDto {
  @ApiProperty({
    example: 'SGDM',
  })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 'Nhóm khách hàng cơ bản' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_LENGTH' })
  name: string;

  @ApiPropertyOptional({
    example: 'Nhóm này gồm phần lớn khách hàng bao gồm cả khách hàng mới.',
  })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ example: 'Tập khách hàng lớn nhất.' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;
}
