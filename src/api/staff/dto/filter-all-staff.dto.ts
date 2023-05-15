import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum, AdminRolesStringEnum, SortEnum } from './../../../enums';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterAllStaffDto {
  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'KEYWORDS_IS_STRING' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ example: GenderEnum.OTHER, enum: GenderEnum })
  @IsEnum(['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER], {
    message: 'GENDER_IS_ENUM',
  })
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsOptional()
  gender: GenderEnum;

  @ApiPropertyOptional({ example: AdminRolesStringEnum.STAFF, enum: AdminRolesStringEnum })
  @IsEnum(AdminRolesStringEnum, {
    message: 'IS_MANAGER_IS_ENUM',
  })
  @IsOptional()
  isManage: AdminRolesStringEnum;

  @ApiPropertyOptional({ example: SortEnum.ASC, enum: SortEnum })
  @IsString({ message: 'SORT_IS_STRING' })
  @IsEnum(SortEnum, { message: 'SORT_IS_ENUM' })
  @IsOptional()
  sort: SortEnum;
}
