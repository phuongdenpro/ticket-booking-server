import { Customer } from './../../database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { AuthUserController } from './user.controller';
import { AuthUserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [AuthUserController],
  providers: [AuthUserService, AuthService],
  exports: [AuthUserService],
})
export class AuthUserModule {}
