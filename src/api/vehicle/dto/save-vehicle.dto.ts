import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
  Length,
  IsArray,
} from 'class-validator';
import { ImageResource } from './../../../database/entities';
import { VehicleTypeEnum, VehicleSeatsEnum } from './../../../enums';

export class SaveVehicleDto {
  @ApiProperty({ example: 'Xe giường nằm Limousine số 1' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiProperty({ example: 'Xe giường nằm Limousine số 1, 34 chỗ, phòng đôi' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000, {
    message: 'description must be between 1 and 1000 characters',
  })
  description: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.SLEEPER_BUS,
    enum: VehicleTypeEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(VehicleTypeEnum)
  type: string;

  @ApiProperty({ example: '51A-111.11' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20, {
    message: 'License Plate must be between 1 and 20 characters',
  })
  licensePlate: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  floorNumber: number;

  @ApiProperty({ example: VehicleSeatsEnum.LIMOUSINE, enum: VehicleSeatsEnum })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(VehicleSeatsEnum)
  totalSeat: number;

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
