import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsPhoneNumber,
  IsDate,
  IsNumber,
} from 'class-validator';
import { SortEnum } from '../../../enums';
import { GenderEnum } from '../../../enums/gender.enum';
import { Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiPropertyOptional({ example: 'superman@gmail.com' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @MinLength(6, { message: 'EMAIL_LENGTH' })
  @MaxLength(100, { message: 'EMAIL_LENGTH' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0354043344' })
  @IsNotEmpty({ message: 'PHONE_IS_REQUIRED' })
  @IsPhoneNumber('VN', { message: 'INVALID_PHONE_NUMBER' })
  @IsString({ message: 'PHONE_IS_STRING' })
  phone: string;

  @ApiProperty({ example: '12345678' })
  @IsOptional()
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MinLength(6, { message: 'PASSWORD_IS_MIN_LENGTH_6' })
  @MaxLength(255, { message: 'PASSWORD_IS_MAX_LENGTH_255' })
  password?: string;

  @ApiProperty({ example: 'superman' })
  @IsNotEmpty({ message: 'FULL_NAME_IS_REQUIRED' })
  @IsString({ message: 'FULL_NAME_IS_STRING' })
  @MinLength(1, { message: 'FULL_NAME_IS_MIN_LENGTH_1' })
  @MaxLength(255, { message: 'FULL_NAME_IS_MAX_LENGTH_255' })
  fullName: string;

  @ApiProperty({ example: 26914 })
  @IsNotEmpty({ message: 'WARD_ID_IS_REQUIRED' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'WARD_CODE_IS_NUMBER' },
  )
  wardCode: number;

  @ApiProperty({
    example: 'Demo, Phường 26, Bình Thạnh, Thành phố Hồ Chí Minh',
  })
  @IsNotEmpty({ message: 'ADDRESS_IS_REQUIRED' })
  @IsString({ message: 'ADDRESS_IS_STRING' })
  @Length(1, 255, { message: 'ADDRESS_BETWEEN_1_255_CHARACTERS' })
  address: string;

  @ApiPropertyOptional({ example: new Date(`${new Date().toDateString()}`) })
  @IsDate({ message: 'BIRTHDAY_IS_DATE' })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({ example: GenderEnum.OTHER, enum: GenderEnum })
  @IsEnum(['', GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER], {
    message: 'GENDER_IS_ENUM',
  })
  @IsString({ message: 'GENDER_IS_STRING' })
  @IsOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional({ example: '0ade8728-4647-4985-8b34-f59a21b0baf5' })
  @IsString({ message: 'EMAIL_IS_STRING' })
  @IsOptional()
  customerGroupId?: string;
}
