import { TripStatusEnum } from '../../../enums/trip-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  Length,
  IsDate,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class SaveTripDto {
  @ApiProperty({ example: 'Bến xe miền đông - Bến xe Đức Long Bảo Lộc' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiPropertyOptional({
    example:
      'Từ Hồ Chí Minh đi Bến xe Đức Long Bảo Lộc xuất phát từ 5h chiều hằng ngày',
  })
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty({ example: '2023-02-12' })
  @IsNotEmpty({ message: 'start date is required' })
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ example: '2024-02-15T02:37:29.450Z' })
  @IsDate({ message: 'End date is date' })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ example: 'd7d44845-b906-4a3c-be7b-232cc555f019' })
  @IsString({ message: 'From Station Id is string' })
  @IsNotEmpty({ message: 'From Station Id is required' })
  @Length(36, 36, { message: 'From Station Id must be 36 characters' })
  fromStationId: string;

  @ApiProperty({ example: 'd7d44845-b906-4a3c-be7b-232cc555f071' })
  @IsString({ message: 'To Station Id is string' })
  @IsNotEmpty({ message: 'To Station Id is required' })
  @Length(36, 36, { message: 'To Station Id must be 36 characters' })
  toStationId: string;

  @ApiPropertyOptional({ example: TripStatusEnum.ACTIVE, enum: TripStatusEnum })
  @IsOptional()
  @IsEnum(TripStatusEnum)
  @IsNumber()
  @Min(0)
  @Max(1)
  isActive: TripStatusEnum;
}
