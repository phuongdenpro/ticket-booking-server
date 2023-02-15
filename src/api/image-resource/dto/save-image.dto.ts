import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveImageResourceDto {
  @ApiProperty({
    example: 'https://static.vexere.com/production/images/1582630998582.jpeg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'c1d47ef4-4310-4d1c-ab82-eb417af04bb1' })
  @IsOptional()
  @IsString()
  stationId: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  vehicleId: string;
}
