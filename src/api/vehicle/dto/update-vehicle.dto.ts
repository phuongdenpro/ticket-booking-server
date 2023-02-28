import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ImageResource } from './../../../database/entities';
import { VehicleTypeEnum, VehicleSeatsEnum } from './../../../enums';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Xe giường nằm Limousine số 1' })
  @IsString({ message: 'Name is string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: 'Xe giường nằm Limousine số 1, 34 chỗ, phòng đôi',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.SLEEPER_BUS,
    enum: VehicleTypeEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(VehicleTypeEnum)
  type: string;

  @ApiPropertyOptional({ example: '51A-111.11' })
  @IsOptional()
  @IsString()
  licensePlate: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  floorNumber: number;

  @ApiPropertyOptional({
    example: VehicleSeatsEnum.LIMOUSINE,
    enum: VehicleSeatsEnum,
  })
  @IsOptional()
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
