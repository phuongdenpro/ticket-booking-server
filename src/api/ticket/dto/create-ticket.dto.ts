import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinDate,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: '2023-03-01' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'START_DATE_GREATER_THAN_NOW',
  })
  startDate: Date;

  @ApiProperty({ example: '2023-03-31' })
  @IsNotEmpty({ message: 'START_DATE_IS_REQUIRED' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'END_DATE_GREATER_THAN_NOW',
  })
  endDate: Date;

  @ApiProperty({ example: 'b87985ac-3b08-46bf-8e6f-02902dcaedaf' })
  @IsNotEmpty({ message: 'TRIP_DETAIL_ID_REQUIRED' })
  @IsString({ message: 'TRIP_DETAIL_ID_IS_STRING' })
  @Length(36, 36, { message: 'TRIP_DETAIL_ID_IS_36_CHARACTERS' })
  tripDetailId: string;
}
