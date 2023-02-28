import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatusEnum, GenderEnum } from '../../../enums';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'superman' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'superman' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: new Date() })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiPropertyOptional({ example: '09xxxxxxxx' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional({ example: GenderEnum.FEMALE, enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiPropertyOptional({
    example: UserStatusEnum.INACTIVATE,
    enum: UserStatusEnum,
  })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;
}
