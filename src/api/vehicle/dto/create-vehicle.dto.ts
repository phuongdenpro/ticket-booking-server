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
import { ImageResource } from '../../../database/entities';
import { VehicleTypeEnum, VehicleSeatsEnum } from '../../../enums';

export class CreateVehicleDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 'Xe giường nằm Limousine số 1' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiProperty({ example: 'Xe giường nằm Limousine số 1, 34 chỗ, phòng đôi' })
  @IsString({ message: 'DESCRIPTION_IS_STRING' })
  @Length(0, 1000, { message: 'DESCRIPTION_BETWEEN_1_1000_CHARACTERS' })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.SLEEPER_BUS,
    enum: VehicleTypeEnum,
  })
  @IsNotEmpty({ message: 'VEHICLE_TYPE_REQUIRED' })
  @IsString({ message: 'VEHICLE_TYPE_STRING' })
  @IsEnum(VehicleTypeEnum, { message: 'VEHICLE_TYPE_IS_ENUM' })
  type?: VehicleTypeEnum;

  @ApiProperty({ example: '51A-111.11' })
  @IsNotEmpty({ message: 'LICENSE_PLATE_REQUIRED' })
  @IsString({ message: 'LICENSE_PLATE_STRING' })
  @Length(1, 20, { message: 'LICENSE_PLATE_BETWEEN_1_20_CHARACTERS' })
  licensePlate: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'VEHICLE_FLOOR_NUMBER_IS_NUMBER' },
  )
  @Min(1, { message: 'VEHICLE_FLOOR_NUMBER_MIN_MAX' })
  @Max(2, { message: 'VEHICLE_FLOOR_NUMBER_MIN_MAX' })
  @IsOptional()
  floorNumber?: number;

  @ApiProperty({ example: VehicleSeatsEnum.LIMOUSINE, enum: VehicleSeatsEnum })
  @IsNotEmpty({ message: 'VEHICLE_TOTAL_SEAT_IS_REQUIRE' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'VEHICLE_TOTAL_SEAT_IS_NUMBER' },
  )
  @IsEnum(VehicleSeatsEnum, { message: 'VEHICLE_TOTAL_SEAT_IS_ENUM' })
  totalSeat: number;

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
