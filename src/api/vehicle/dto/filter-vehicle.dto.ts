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
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.LIMOUSINE,
    enum: VehicleTypeEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(VehicleTypeEnum)
  type: VehicleTypeEnum;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(2)
  floorNumber: number;
}
