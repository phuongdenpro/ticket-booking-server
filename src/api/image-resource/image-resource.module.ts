import { UploadService } from './../upload/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ImageResourceService } from './image-resource.service';
import { ImageResource, Station, Vehicle } from './../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ImageResource, Station, Vehicle])],
  providers: [ImageResourceService, UploadService],
  controllers: [],
  exports: [ImageResourceService],
})
export class ImageResourceModule {}
