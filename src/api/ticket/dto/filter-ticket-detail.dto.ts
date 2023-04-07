import { SortEnum, TicketStatusEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterTicketDetailDto {
  @ApiPropertyOptional({ example: '1' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({
    example: TicketStatusEnum.NON_SOLD,
    enum: TicketStatusEnum,
  })
  @IsString({ message: 'STATUS_IS_STRING' })
  @IsEnum(TicketStatusEnum, { message: 'TICKET_STATUS_IS_ENUM' })
  @IsOptional()
  status?: TicketStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsOptional()
  sort?: SortEnum;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TICKET_CODE_IS_STRING' })
  @IsOptional()
  ticketCode?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TRIP_DETAIL_CODE_IS_STRING' })
  @IsOptional()
  tripDetailCode?: string;
}
