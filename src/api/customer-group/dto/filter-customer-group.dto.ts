import { SortEnum, GenderEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterCustomerDto {
  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString({ message: 'CUSTOMER_NAME_IS_STRING' })
  customerName: string;

  @ApiPropertyOptional({ example: GenderEnum.MALE, enum: GenderEnum })
  @IsOptional()
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsEnum(GenderEnum, { message: 'GENDER_IS_ENUM' })
  gender: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString({ message: 'PHONE_IS_STRING' })
  phone: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString({ message: 'EMAIL_IS_STRING' })
  email: string;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsOptional()
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort: SortEnum;
}
