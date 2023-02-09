import { DeleteStatusEnum } from 'src/enums/delete-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class HiddenSeatDto {
  @ApiPropertyOptional({
    example: DeleteStatusEnum.NOT_DELETED,
    description: '1: hidden, 0: show',
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DeleteStatusEnum)
  status: DeleteStatusEnum;
}
