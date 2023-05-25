import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TripDetailStatusEnum } from '../../../enums';

export class UpdateTripDetailForTripDto {
  @ApiPropertyOptional({ example: '2023-02-12' })
  @IsOptional()
  @IsDate({ message: 'INVALID_DATE' })
  departureTime: Date;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  // @IsDate({ context: { errorCode: 400, description: 'INVALID_DATE' } })
  travelHours: number;

  @ApiPropertyOptional({
    example: TripDetailStatusEnum.NOT_SOLD_OUT,
    enum: TripDetailStatusEnum,
  })
  @IsOptional()
  @IsString({ message: 'INVALID_STRING' })
  @IsEnum(TripDetailStatusEnum, { message: 'INVALID_TRIP_DETAIL_STATUS' })
  status: string;

  @ApiPropertyOptional({ example: '8d453086-e6a2-4a2e-a407-5ce2be3b0ba8' })
  @IsString({ message: 'VEHICLE_ID_IS_STRING' })
  @IsOptional()
  vehicleId: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'VEHICLE_CODE_IS_STRING' })
  @IsOptional()
  vehicleCode: string;
}
