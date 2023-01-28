import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveWardDto {
  @ApiPropertyOptional({ example: 'Thị trấn Đông Anh' })
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({ example: 'thị trấn' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  type: string;

  @ApiPropertyOptional({ example: 454 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiPropertyOptional({ example: 'thi_tran_dong_anh' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nameWithType: string;

  @ApiPropertyOptional({ example: 17 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  districtCode: number;
}
