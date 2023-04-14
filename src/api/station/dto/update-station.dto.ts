import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Length,
} from 'class-validator';
import { ImageResource } from '../../../database/entities';

export class UpdateStationDto {
  @ApiPropertyOptional({ example: 'Bến xe Demo' })
  @IsOptional()
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(0, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiPropertyOptional({
    example: 'Demo',
  })
  @IsOptional()
  @IsString({ message: 'ADDRESS_MUST_BE_STRING' })
  @Length(0, 255, { message: 'ADDRESS_BETWEEN_1_255_CHARACTERS' })
  address: string;

  @ApiPropertyOptional({ example: 26914 })
  @IsOptional()
  @IsNotEmpty({ message: 'WARD_ID_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'WARD_CODE_MUST_BE_NUMBER' },
  )
  wardCode: number;

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
  images?: ImageResource[];
}
