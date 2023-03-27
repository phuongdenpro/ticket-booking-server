import { VehicleTypeEnum } from './../../../enums';
import { SortEnum } from './../../../enums/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';

export class FilterPriceDetailDto {
  @ApiPropertyOptional({ example: 100000 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'PRICE_IS_NUMBER' },
  )
  @Min(0, { message: 'PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0' })
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ example: 'chuyến xe lúc 5h sài gòn - đà lạt' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keywords: string;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'PRICE_LIST_CODE_IS_STRING' })
  @IsOptional()
  priceListCode: string;

  @ApiPropertyOptional({
    example: VehicleTypeEnum.LIMOUSINE,
    enum: [
      '',
      VehicleTypeEnum.LIMOUSINE,
      VehicleTypeEnum.SLEEPER_BUS,
      VehicleTypeEnum.SEAT_BUS,
    ],
  })
  @IsEnum(
    [
      '',
      VehicleTypeEnum.LIMOUSINE,
      VehicleTypeEnum.SLEEPER_BUS,
      VehicleTypeEnum.SEAT_BUS,
    ],
    { message: 'SEAT_TYPE_IS_ENUM' },
  )
  @IsOptional()
  seatType: VehicleTypeEnum;

  @ApiPropertyOptional({
    example: SortEnum.DESC,
    enum: ['', SortEnum.ASC, SortEnum.DESC],
  })
  @IsEnum(['', SortEnum.ASC, SortEnum.DESC], { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;
}
