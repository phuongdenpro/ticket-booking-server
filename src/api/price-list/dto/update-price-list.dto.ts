import { ActiveStatusEnum } from '../../../enums/active-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';

export class UpdatePriceListDto {
  @ApiPropertyOptional({ example: 'Bảng giá tháng 3/2023' })
  @IsString({ message: 'NAME_IS_STRING' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '2023-03-01' })
  @IsDate({ message: 'START_DATE_IS_DATE' })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-03-31' })
  @IsDate({ message: 'END_DATE_IS_DATE' })
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 'Bảng giá tháng 3/2023' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: ActiveStatusEnum.ACTIVE,
    enum: ActiveStatusEnum,
  })
  @IsString({ message: 'PRICE_LIST_STATUS_IS_STRING' })
  @IsEnum(ActiveStatusEnum, { message: 'PRICE_LIST_STATUS_INVALID' })
  @IsOptional()
  status: ActiveStatusEnum;
}
