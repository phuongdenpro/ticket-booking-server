import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { Ward, District } from 'src/database/entities';
import { DistrictService } from '../district/district.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward, District])],
  controllers: [WardController],
  providers: [WardService, DistrictService],
  exports: [WardService],
})
export class WardModule {}
