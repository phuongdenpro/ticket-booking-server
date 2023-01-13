import { Province } from './../../../database/entities/vi-address-provide.entities';
import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [ProvinceService],
})
export class ProvinceModule {}
