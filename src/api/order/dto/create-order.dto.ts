import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEnum } from './../../../enums';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: OrderStatusEnum.UNPAID,
    enum: OrderStatusEnum,
  })
  @IsString({ message: 'ORDER_STATUS_IS_STRING' })
  @IsEnum(OrderStatusEnum, { message: 'ORDER_STATUS_IS_ENUM' })
  @IsOptional()
  status: OrderStatusEnum;

  @ApiPropertyOptional({
    example: [
      '7b1e022a-96da-47c5-85b6-81858fd0f610',
      '7b1e022a-96da-47c5-85b6-81858fd0f617',
    ],
  })
  @IsArray({ message: 'SEAT_IDS_IS_ARRAY' })
  @IsOptional()
  seatIds: string[];

  @ApiPropertyOptional({ example: ['XGNL2A11', 'XGNL2B1'] })
  @IsArray({ message: 'SEAT_CODES_IS_ARRAY' })
  @IsOptional()
  seatCodes: string[];

  @ApiProperty({ example: 'eead4881-ecee-45c8-a2dc-3044660916cb' })
  @IsNotEmpty({ message: 'TRIP_DETAIL_ID_REQUIRED' })
  @IsString({ message: 'TRIP_DETAIL_ID_IS_STRING' })
  @Length(36, 36, { message: 'TRIP_DETAIL_ID_IS_36_CHARACTERS' })
  tripDetailId: string;
}
