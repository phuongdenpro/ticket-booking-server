import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '../../../enums';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateCustomerForAdminDto {
  @ApiPropertyOptional({ example: 'superman' })
  @IsString({ message: 'FULL_NAME_IS_STRING' })
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '09xxxxxxxx' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '',
    enum: ['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER],
  })
  @IsEnum(['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER], {
    message: 'GENDER_IS_ENUM',
  })
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional({ example: 'quang trung' })
  @IsString({ message: 'ADDRESS_IS_STRING' })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: new Date(`${new Date().toDateString()}`) })
  @IsDate({ message: 'BIRTHDAY_IS_DATE' })
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ example: 5514 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'WARD_ID_IS_NUMBER' },
  )
  @IsOptional()
  wardId?: number;

  @ApiPropertyOptional({ example: 27007 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'WARD_CODE_IS_NUMBER' },
  )
  @IsOptional()
  wardCode?: number;

  @ApiPropertyOptional({ example: 'e80fcd4f-acad-4b04-b862-f66468348bb3' })
  @IsString({ message: 'CUSTOMER_GROUP_ID_IS_STRING' })
  @IsOptional()
  customerGroupId: string;

  @ApiPropertyOptional({ example: 5514 })
  @IsString({ message: 'CUSTOMER_GROUP_CODE_IS_STRING' })
  @IsOptional()
  customerGroupCode: string;
}
