import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ImageResourceService } from './image-resource.service';
import { ImageResource, Station, Vehicle } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ImageResource, Station, Vehicle])],
  providers: [ImageResourceService],
  exports: [ImageResourceService],
})
export class ImageResourceModule {}
