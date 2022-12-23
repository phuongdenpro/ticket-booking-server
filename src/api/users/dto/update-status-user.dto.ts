import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from 'src/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusUserDto {
  @IsEnum(UserStatusEnum)
  @ApiProperty({ example: UserStatusEnum.INACTIVATE })
  @IsNotEmpty()
  status: number;
}
