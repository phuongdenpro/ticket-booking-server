import { ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatusEnum } from './../../../enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class UpdateTicketDetailDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: TicketStatusEnum.NON_SOLD,
    enum: TicketStatusEnum,
  })
  @IsString({ message: 'TICKET_STATUS_IS_STRING' })
  @IsEnum(TicketStatusEnum, { message: 'TICKET_STATUS_IS_ENUM' })
  @IsOptional()
  status: TicketStatusEnum;
}
