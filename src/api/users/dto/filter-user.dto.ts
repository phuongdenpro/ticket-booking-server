import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatusEnum } from 'src/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords: string;

  @ApiPropertyOptional({ example: UserStatusEnum.INACTIVATE })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
