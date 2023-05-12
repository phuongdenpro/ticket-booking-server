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
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiProperty({
    example: 'Demo',
  })
  @IsNotEmpty({ message: 'ADDRESS_IS_REQUIRED' })
  @IsString({ message: 'ADDRESS_MUST_BE_STRING' })
  @Length(1, 255, { message: 'ADDRESS_BETWEEN_1_255_CHARACTERS' })
  address: string;

  @ApiProperty({
    example: 'SGDM',
  })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: '  ' })
  code: string;

  @ApiProperty({ example: 26914 })
  @IsNotEmpty({ message: 'WARD_ID_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'WARD_CODE_MUST_BE_NUMBER' },
  )
  wardCode: number;

  @ApiPropertyOptional({
    example: [
      {
        url: 'https://res.cloudinary.com/dangdan2807/image/upload/v1668737017/ee0ygsbjvymvyfrugrtp.jpg',
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
