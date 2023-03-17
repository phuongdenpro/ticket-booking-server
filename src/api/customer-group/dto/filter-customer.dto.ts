import { SortEnum, GenderEnum } from '../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterCustomerDto {
  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  keywords?: string;

  @ApiPropertyOptional({
    example: GenderEnum.MALE,
    enum: ['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER],
  })
  @IsOptional()
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsEnum(GenderEnum, { message: 'GENDER_IS_ENUM' })
  gender?: string;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsOptional()
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort?: SortEnum;
}
