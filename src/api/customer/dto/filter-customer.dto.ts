import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatusEnum } from '../../../enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords: string;

  @ApiPropertyOptional({
    example: UserStatusEnum.INACTIVATE,
    enum: UserStatusEnum,
  })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
