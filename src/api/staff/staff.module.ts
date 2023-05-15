import { Staff } from './../../database/entities';
import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './../../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [StaffController],
  providers: [StaffService, AuthService],
  exports: [StaffService],
})
export class StaffModule {}
