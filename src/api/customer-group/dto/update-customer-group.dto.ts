import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateCustomerGroupDto {
  @ApiProperty({
    example: 'SGDM',
  })
  @IsOptional()
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 255, { message: 'CODE_BETWEEN_1_10_CHARACTERS' })
  code?: string;

  @ApiProperty({ example: 'Nhóm khách hàng cơ bản' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Nhóm này gồm phần lớn khách hàng bao gồm cả khách hàng mới.',
  })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Tập khách hàng lớn nhất.' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note?: string;
}
