import {  ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum, AdminRolesStringEnum } from '../../../enums';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as moment from 'moment';

export class UpdateStaffDto {
  @ApiPropertyOptional({ example: '0389324159' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'dangdan2807@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: 'superman' })
  @IsString({ message: 'FULL_NAME_MUST_BE_STRING' })
  @MaxLength(255, { message: 'FULL_NAME_IS_MAX_LENGTH_255' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ example: GenderEnum.OTHER, enum: GenderEnum })
  @IsEnum(['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER], {
    message: 'GENDER_IS_ENUM',
  })
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsOptional()
  gender: GenderEnum;

  @ApiPropertyOptional({
    example: 'Demo',
  })
  @IsString({ message: 'ADDRESS_MUST_BE_STRING' })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    example: '',
  })
  @IsString({ message: 'NOTE_IS_STRING' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ example: moment().subtract(18, 'years').toDate() })
  @IsDate({ message: 'BIRTHDAY_IS_DATE' })
  @IsOptional()
  birthDay: Date;

  @ApiPropertyOptional({ example: AdminRolesStringEnum.STAFF, enum: AdminRolesStringEnum })
  @IsEnum(AdminRolesStringEnum, {
    message: 'IS_MANAGER_IS_ENUM',
  })
  @IsOptional()
  isManage: AdminRolesStringEnum;

  @ApiPropertyOptional({ example: 26914 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'WARD_CODE_MUST_BE_NUMBER' },
  )
  @IsOptional()
  wardCode: number;
}
