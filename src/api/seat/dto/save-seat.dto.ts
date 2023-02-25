import { SeatTypeEnum } from './../../../enums/seat-type.enum';
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

export class SaveSeatDto {
  @ApiProperty({ example: 'A1' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: SeatTypeEnum.NON_SALES, enum: SeatTypeEnum })
  @IsOptional()
  @IsString()
  @IsEnum(SeatTypeEnum)
  type: SeatTypeEnum;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  floor: number;

  @ApiProperty({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsNotEmpty({ message: 'Vehicle is required' })
  @IsString({ message: 'Vehicle is string' })
  vehicleId: string;
}
