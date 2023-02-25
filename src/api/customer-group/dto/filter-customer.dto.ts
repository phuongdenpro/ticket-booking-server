import { SortEnum } from './../../../enums/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterCustomerGroupDto {
  @ApiPropertyOptional({ example: 'cao cấp' })
  @IsOptional()
  @IsString({ message: 'CUSTOMER_GROUP_NAME_IS_STRING' })
  customerGroupName: string;

  @ApiPropertyOptional({ example: SortEnum.ASC })
  @IsOptional()
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  sort: SortEnum;

  // @ApiPropertyOptional({ example: '' })
  // @IsOptional()
  // @IsString({ message: 'CUSTOMER_NAME_IS_STRING' })
  // customerName: string;

  // @ApiPropertyOptional({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  // @IsOptional()
  // @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  // customerGroupId: string;
}
