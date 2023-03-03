import { SortEnum } from './../../../enums/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';

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

  @ApiPropertyOptional({ example: '1fbaba64-77c4-4403-9d14-73c03e3d0954' })
  @IsString({ message: 'PRICE_LIST_ID_IS_STRING' })
  @IsNotEmpty({ message: 'PRICE_LIST_ID_IS_REQUIRED' })
  @Length(36, 36, { message: 'PRICE_LIST_ID_IS_36_CHARACTERS' })
  @IsOptional()
  priceListId: string;

  @ApiPropertyOptional({ example: SortEnum.DESC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort: SortEnum;
}
