import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum, AdminRolesStringEnum } from './../../../enums';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class CreateStaffDto {
  @ApiProperty({ example: '0389324159' })
  @IsNotEmpty({ message: 'PHONE_REQUIRED' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  phone: string;
  
  @ApiProperty({ example: 'dangdan2807@gmail.com' })
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({ example: 'superman' })
  @IsNotEmpty({ message: 'FULL_NAME_IS_REQUIRED' })
  @IsString({ message: 'FULL_NAME_MUST_BE_STRING' })
  @MinLength(1, { message: 'FULL_NAME_IS_MIN_LENGTH_1' })
  @MaxLength(255, { message: 'FULL_NAME_IS_MAX_LENGTH_255' })
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
