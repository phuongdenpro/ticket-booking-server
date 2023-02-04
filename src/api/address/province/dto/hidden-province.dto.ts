import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeleteStatusEnum } from 'src/enums/delete-status.enum';

export class HiddenProvinceDto {
  @ApiPropertyOptional({
    example: DeleteStatusEnum.NOT_DELETED,
    description: '1: hidden, 0: show',
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(DeleteStatusEnum, { message: 'Status is invalid' })
  status: DeleteStatusEnum;
}
