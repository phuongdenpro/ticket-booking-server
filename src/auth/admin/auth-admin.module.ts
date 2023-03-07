import { Staff } from '../../database/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, AuthService],
  exports: [AuthAdminService],
})
export class AuthAdminModule {}
