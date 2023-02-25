import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Length,
} from 'class-validator';
import { ImageResource } from './../../../database/entities';

export class SaveStationDto {
  @ApiProperty({ example: 'Bến xe Demo' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiProperty({
    example: 'Demo, Phường 26, Bình Thạnh, Thành phố Hồ Chí Minh',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255, { message: 'Address must be between 1 and 100 characters' })
  address: string;

  @ApiProperty({ example: 26914 })
  @IsNotEmpty()
  @IsNumber()
  wardId: number;

  @ApiPropertyOptional({
    example: [
      {
        id: '1',
        url: 'https://res.cloudinary.com/dangdan2807/image/upload/v1668737017/ee0ygsbjvymvyfrugrtp.jpg',
        isDeleted: true,
      },
      {
        url: 'https://res.cloudinary.com/dangdan2807/image/upload/v1668737015/tb7fssdjfjuvn6qcrajy.png',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @Type(() => ImageResource)
  images?: ImageResource[];
}
