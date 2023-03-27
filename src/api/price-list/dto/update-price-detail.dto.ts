import { VehicleTypeEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';

export class UpdatePriceDetailDto {
  @ApiPropertyOptional({ example: 100000 })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 3,
    },
    { message: 'PRICE_IS_NUMBER' },
  )
  @Min(0, { message: 'PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0' })
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ example: 'chuyến xe lúc 5h sài gòn - đà lạt' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.LIMOUSINE,
    enum: VehicleTypeEnum,
  })
  @IsEnum(VehicleTypeEnum, { message: 'SEAT_TYPE_IS_ENUM' })
  @IsOptional()
  seatType: VehicleTypeEnum;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'TRIP_CODE_IS_STRING' })
  @IsOptional()
  tripCode: string;
}
