import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TripDetailStatusEnum } from './../../../enums';

export class UpdateTripDetailDto {
  @ApiPropertyOptional({ example: '2023-02-12' })
  @IsOptional()
  @IsDate({ message: 'INVALID_DATE' })
  departureTime: Date;

  @ApiPropertyOptional({ example: '2023-02-12' })
  @IsOptional()
  @IsDate({ context: { errorCode: 400, description: 'INVALID_DATE' } })
  expectedTime: Date;

  @ApiPropertyOptional({
    example: TripDetailStatusEnum.SALES,
    enum: TripDetailStatusEnum,
  })
  @IsOptional()
  @IsString({ message: 'INVALID_STRING' })
  @IsEnum(TripDetailStatusEnum, { message: 'INVALID_TRIP_DETAIL_STATUS' })
  status: string;

  @ApiPropertyOptional({ example: '59464f9b-0be3-4929-b1ea-d2aa80c21a6a' })
  @IsOptional()
  @IsString({ message: 'TRIP_ID_IS_STRING' })
  tripId: string;

  @ApiPropertyOptional({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsOptional()
  @IsString({ message: 'VEHICLE_ID_IS_STRING' })
  vehicleId: string;
}
