import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, MinDate } from 'class-validator';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: '2023-03-01' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'START_DATE_GREATER_THAN_NOW',
  })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-03-31' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @MinDate(new Date(`${new Date().toDateString()}`), {
    message: 'END_DATE_GREATER_THAN_NOW',
  })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 'b87985ac-3b08-46bf-8e6f-02902dcaedaf' })
  @IsString({ message: 'TRIP_DETAIL_ID_IS_STRING' })
  @IsOptional()
  tripDetailId: string;
}
