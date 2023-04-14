import { UserStatusEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
} from 'class-validator';
import { GenderEnum } from '../../../enums/gender.enum';

export class UpdateCustomerForAdminDto {
  @ApiPropertyOptional({ example: 'superman' })
  @IsString({ message: 'FULL_NAME_MUST_BE_STRING' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ example: 26914 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'WARD_CODE_MUST_BE_NUMBER' },
  )
  @IsOptional()
  wardCode?: number;

  @ApiPropertyOptional({ example: 'Demo' })
  @IsString({ message: 'ADDRESS_MUST_BE_STRING' })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ example: new Date('2000-01-01') })
  @IsDate({ message: 'BIRTHDAY_IS_DATE' })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({ example: GenderEnum.OTHER, enum: GenderEnum })
  @IsEnum(GenderEnum, { message: 'GENDER_IS_ENUM' })
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional({ example: '' })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @IsOptional()
  customerGroupId?: string;

  @ApiPropertyOptional({ example: 'DEFAULT' })
  @IsString({ message: 'CUSTOMER_GROUP_CODE_IS_STRING' })
  @IsOptional()
  customerGroupCode?: string;

  @ApiPropertyOptional({
    example: UserStatusEnum.INACTIVATE,
    enum: UserStatusEnum,
  })
  @IsEnum(UserStatusEnum, { message: 'CUSTOMER_STATUS_IS_ENUM' })
  @IsString({ message: 'CUSTOMER_STATUS_IS_STRING' })
  @IsOptional()
  status: UserStatusEnum;
}
