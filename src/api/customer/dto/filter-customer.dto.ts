import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortEnum, UserStatusEnum } from '../../../enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  keywords: string;

  @ApiPropertyOptional({
    example: UserStatusEnum.ACTIVE,
    enum: UserStatusEnum,
  })
  @IsOptional()
  @IsEnum(UserStatusEnum, { message: 'CUSTOMER_STATUS_IS_ENUM' })
  status: UserStatusEnum;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;
}
