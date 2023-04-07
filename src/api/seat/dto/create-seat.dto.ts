import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: 'A1' })
  @IsNotEmpty({ message: 'NAME_IS_REQUIRED' })
  @IsString({ message: 'NAME_IS_STRING' })
  @Length(1, 100, { message: 'NAME_BETWEEN_1_100_CHARACTERS' })
  name: string;

  @ApiPropertyOptional({ example: 1, enum: [1, 2] })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    { message: 'FLOOR_IS_NUMBER' },
  )
  @Min(1, { message: 'SEAT_FLOOR_MIN_MAX' })
  @Max(2, { message: 'SEAT_FLOOR_MIN_MAX' })
  @IsEnum([1, 2], { message: 'SEAT_FLOOR_MIN_MAX' })
  @IsOptional()
  floor: number;

  @ApiProperty({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsNotEmpty({ message: ' VEHICLE_ID_REQUIRED' })
  @IsString({ message: 'VEHICLE_ID_IS_STRING' })
  vehicleId: string;
}
