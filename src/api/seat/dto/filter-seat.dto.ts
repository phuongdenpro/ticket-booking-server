import { SeatTypeEnum } from './../../../enums/seat-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';

export class FilterSeatDto {
  @ApiPropertyOptional({ example: 'A1' })
  @IsString({ message: 'Name is string' })
  @Length(0, 100, { message: 'Name must be between 0 and 100 characters' })
  @IsOptional()
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
}
