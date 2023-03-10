import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: ['', ''], type: [String] })
  @IsNotEmpty({ message: 'SEAT_ID_IS_REQUIRED' })
  @IsArray({ message: 'SEAT_ID_IS_ARRAY' })
  seatIds: string[];

  @ApiProperty({ example: 'b87985ac-3b08-46bf-8e6f-02902dcaedaf' })
  @IsNotEmpty({ message: 'TRIP_DETAIL_ID_REQUIRED' })
  @IsString({ message: 'TRIP_DETAIL_ID_IS_STRING' })
  @Length(36, 36, { message: 'TRIP_DETAIL_ID_IS_36_CHARACTERS' })
  tripDetailId: string;
}
