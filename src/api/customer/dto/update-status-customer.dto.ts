import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from '../../../enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusCustomerDto {
  @IsEnum(UserStatusEnum)
  @ApiProperty({ example: UserStatusEnum.INACTIVATE, enum: UserStatusEnum })
  @IsNotEmpty()
  status: UserStatusEnum;
}
