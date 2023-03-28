import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TripDetailStatusEnum } from '../../../enums';
import * as moment from 'moment';
moment.locale('vi');

export class CreateTripDetailDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: '2023-02-12' })
  @IsNotEmpty({ message: 'DEPARTURE_DATE_REQUIRED' })
  @IsDate({ message: 'INVALID_DATE' })
  departureTime: Date;

  @ApiProperty({ example: '2023-02-12' })
  @IsNotEmpty({ message: 'EXPECTED_DATE_REQUIRED' })
  @IsDate({ context: { errorCode: 400, description: 'INVALID_DATE' } })
  expectedTime: Date;

  @ApiPropertyOptional({
    example: TripDetailStatusEnum.NOT_SOLD_OUT,
    enum: TripDetailStatusEnum,
  })
  @IsOptional()
  @IsString({ message: 'INVALID_STRING' })
  @IsEnum(TripDetailStatusEnum, { message: 'INVALID_TRIP_DETAIL_STATUS' })
  status: string;

  @ApiProperty({ example: '59464f9b-0be3-4929-b1ea-d2aa80c21a6a' })
  @IsString({ message: 'TRIP_ID_IS_STRING' })
  @IsOptional()
  tripId: string;

  @ApiProperty({ example: '' })
  @IsString({ message: 'TRIP_CODE_IS_STRING' })
  @IsOptional()
  tripCode: string;

  @ApiProperty({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsNotEmpty({ message: 'VEHICLE_ID_REQUIRED' })
  @IsString({ message: 'VEHICLE_ID_IS_STRING' })
  @Length(36, 36, { message: 'VEHICLE_ID_INVALID' })
  vehicleId: string;
}
