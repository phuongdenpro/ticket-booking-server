import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveDistrictDto {
  @ApiPropertyOptional({ example: 'Huyện Đông Anh' })
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({ example: 'huyện' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  type: string;

  @ApiPropertyOptional({ example: 17 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiPropertyOptional({ example: 'huyen_dong_anh' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nameWithType: string;

  @ApiPropertyOptional({ example: 1 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  provinceCode: number;
}
