import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTicketDetailDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'CODE_IS_REQUIRED' })
  @IsString({ message: 'CODE_IS_STRING' })
  @Length(1, 100, { message: 'CODE_BETWEEN_1_100_CHARACTERS' })
  code: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'TICKET_ID_IS_REQUIRED' })
  @IsString({ message: 'TICKET_ID_IS_STRING' })
  @Length(36, 36, { message: 'TICKET_ID_IS_36_CHARACTERS' })
  ticketId: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'SEAT_ID_IS_REQUIRED' })
  @IsString({ message: 'SEAT_ID_IS_STRING' })
  @Length(36, 36, { message: 'SEAT_ID_IS_36_CHARACTERS' })
  seatId: string;
}
