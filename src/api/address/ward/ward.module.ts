import { AdminService } from './../../admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { Ward, District, Staff } from './../../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Ward, District, Staff])],
  controllers: [WardController],
  providers: [WardService, AdminService],
  exports: [WardService],
})
export class WardModule {}
