import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateSeatDto {
  @ApiPropertyOptional({ example: 'A1' })
  @IsString({ message: 'Name is string' })
  @Length(0, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  floor: number;

  @ApiPropertyOptional({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsOptional()
  @IsString({ message: 'Vehicle is string' })
  vehicleId: string;
}
