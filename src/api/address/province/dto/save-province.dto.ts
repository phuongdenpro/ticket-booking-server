import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveProvinceDto {
  @ApiPropertyOptional({ example: 'Thành phố Hà Nội' })
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({ example: 'thành phố trung ương' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  type: string;

  @ApiPropertyOptional({ example: 1 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiPropertyOptional({ example: 'thanh_pho_ha_noi' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nameWithType: string;
}
