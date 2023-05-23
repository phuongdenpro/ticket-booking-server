import { GenderEnum } from './../../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import  * as moment from 'moment';
moment.locale('vi');

export class AdminUpdateDto {
  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0354043344' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsString({ message: 'PHONE_IS_STRING' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ example: 'fullName' })
  @IsString({ message: 'FULL_NAME_MUST_BE_STRING' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({
    example: GenderEnum.MALE,
    enum: ['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER],
  })
  @IsEnum(['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER])
  @IsOptional()
  gender: GenderEnum;

  @ApiPropertyOptional({ example: '12345678' })
  @IsString({ message: 'ADDRESS_MUST_BE_STRING' })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    example: moment().subtract(18, 'years').format('YYYY-MM-DD'),
  })
  @IsString({ message: 'BIRTHDAY_MUST_BE_STRING' })
  @IsOptional()
  birthDay: Date;

  @ApiPropertyOptional({ example: 26914 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'WARD_CODE_MUST_BE_NUMBER' },
  )
  @IsOptional()
  wardCode?: number;

  @ApiPropertyOptional({ example: '123456' })
  @IsString({ message: 'OTP_IS_STRING' })
  @IsOptional()
  otp: string;
}
