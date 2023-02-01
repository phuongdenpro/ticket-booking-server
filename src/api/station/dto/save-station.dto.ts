import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SaveStationDto {
  @ApiPropertyOptional({ example: 'Bến xe Demo' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Demo, Phường 26, Bình Thạnh, Thành phố Hồ Chí Minh',
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 26914 })
  @IsNotEmpty()
  @IsNumber()
  wardId: number;
}
