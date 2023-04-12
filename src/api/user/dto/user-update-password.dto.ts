import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserUpdatePasswordDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'OLD_PASSWORD_REQUIRED' })
  @IsString({ message: 'OLD_PASSWORD_MUST_BE_STRING' })
  oldPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'NEW_PASSWORD_REQUIRED' })
  @IsString({ message: 'NEW_PASSWORD_MUST_BE_STRING' })
  @MinLength(6, { message: 'NEW_PASSWORD_MIN_6_CHARACTERS' })
  newPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'CONFIRM_NEW_PASSWORD_REQUIRED' })
  @IsString({ message: 'CONFIRM_NEW_PASSWORD_MUST_BE_STRING' })
  @MinLength(6, { message: 'CONFIRM_NEW_PASSWORD_MIN_6_CHARACTERS' })
  confirmNewPassword: string;
}
