import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminRefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA4OTI2MTM2LTI2ZDgtNDE3Ni04MjdlLTA2MGNjN2U2Mjg1ZCIsImVtYWlsIjoiZGFuZ2RhbjI4MDdAZ21haWwuY29tIiwidHlwZSI6InN0YWZmIiwiaWF0IjoxNjc0MTM5NjUwLCJleHAiOjE2NzQ3NDQ0NTB9.POmmyjmgN58INWCkakmNujCaKyXJlJCBFuGbrbeyIh8',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
