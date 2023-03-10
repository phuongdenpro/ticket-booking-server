import { SortEnum, TicketStatusEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterTicketDetailDto {
  @ApiPropertyOptional({ example: '1' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({
    example: TicketStatusEnum.NON_SALES,
    enum: TicketStatusEnum,
  })
  @IsString({ message: 'STATUS_IS_STRING' })
  @IsEnum(TicketStatusEnum, { message: 'TICKET_DETAIL_STATUS_IS_ENUM' })
  @IsOptional()
  status?: TicketStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsOptional()
  sort?: SortEnum;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TICKET_ID_IS_STRING' })
  @IsOptional()
  ticketId: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TICKET_CODE_IS_STRING' })
  @IsOptional()
  ticketCode: string;
}
