import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { VehicleTypeEnum } from './../../../enums';

export class FilterVehicleDto {
  @ApiPropertyOptional({ example: 'Xe giường nằm Limousine số 1' })
  @IsString({ message: 'Name is string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.LIMOUSINE,
    enum: VehicleTypeEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(VehicleTypeEnum)
  type: string;

  @ApiPropertyOptional({ example: '51A-111.11' })
  @IsString()
  @IsOptional()
  licensePlate: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(2)
  floorNumber: number;
}
