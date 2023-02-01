import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { Station, Ward } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Ward])],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
