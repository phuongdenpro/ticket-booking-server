import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatusEnum } from 'src/enums';
import { GenderEnum } from 'src/enums';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'superman' })
  @IsOptional()
  @IsString()
  name?: string;

  // @ApiPropertyOptional({ example: 'superman' })
  // @IsOptional()
  // @IsString()
  // username?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiPropertyOptional({ example: UserStatusEnum.INACTIVATE })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;
}
