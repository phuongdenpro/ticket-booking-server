import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class SaveProvinceDto {
  @ApiProperty({ example: 'Thành phố Hà Nội' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name is string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @ApiProperty({ example: 'thành phố trung ương' })
  @IsNotEmpty({ message: 'Type is required' })
  @IsString()
  @Length(1, 50, { message: 'Type must be between 1 and 50 characters' })
  type: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'code is number' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'code is number' },
  )
  code: number;

  @ApiProperty({ example: 'thanh_pho_ha_noi' })
  @IsNotEmpty({ message: 'code name is require' })
  @IsString({ message: 'code name is string' })
  @Length(1, 255, { message: 'code name must be between 1 and 255 characters' })
  codename: string;
}
