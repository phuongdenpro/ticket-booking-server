import { AuthService } from './../../auth/auth.service';
import { Staff } from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [AdminController],
  providers: [AdminService, AuthService],
  exports: [AdminService],
})
export class AdminModule {}
