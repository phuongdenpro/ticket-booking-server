import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatusEnum } from 'src/enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ProfileCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gradeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  className?: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: UserStatusEnum.INACTIVATE })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @ValidateNested({ each: true })
  @ApiPropertyOptional()
  @IsOptional()
  profile?: ProfileCreateDto;
}
