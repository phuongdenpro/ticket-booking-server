import { UploadService } from './../upload/upload.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageResource, Vehicle, Station } from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { DeleteFileUploadDto } from '../upload/dto';

@Injectable()
export class ImageResourceService {
  constructor(
    @InjectRepository(ImageResource)
    private readonly imageResourceRepository: Repository<ImageResource>,
    private readonly uploadService: UploadService,
    private dataSource: DataSource,
  ) {}

  async saveImageResource(
    imageResource: ImageResource,
    userId: string,
    vehicleId?: string,
    stationId?: string,
  ) {
    if (imageResource?.url) {
      const newImage = new ImageResource();
      newImage.url = imageResource.url;
      if (imageResource.id) {
        newImage.id = imageResource.id;
      }
      if (vehicleId) {
        const vehicle = await this.dataSource
          .getRepository(Vehicle)
          .findOne({ where: { id: vehicleId } });
        newImage.vehicle = vehicle;
      }
      if (stationId) {
        const station = await this.dataSource
          .getRepository(Station)
          .findOne({ where: { id: stationId } });
        newImage.station = station;
      }
      if (!vehicleId && !stationId) {
        throw new BadRequestException('INVALID_IMAGE_RESOURCE');
      }
      newImage.createdBy = userId;

      return await this.imageResourceRepository.save(newImage);
    }
  }

  async findImageResourcesByStationId(stationId: string, options?: any) {
    return await this.imageResourceRepository.find({
      where: { station: { id: stationId } },
      ...options,
    });
  }

  async removeImageById(id: string) {
    const imageResource = await this.imageResourceRepository.findOne({
      where: { id },
    });
    if (imageResource) {
      const dto = new DeleteFileUploadDto();
      dto.path = imageResource.url;
      await this.uploadService.deleteFileWithCloudinary(dto);
      return await this.imageResourceRepository.remove(imageResource);
    }
  }

  async removeImageResourcesByStationId(id: string) {
    const imageResources = await this.imageResourceRepository.find({
      where: { station: { id } },
    });
    if (imageResources) {
      imageResources.forEach(async (imageResource) => {
        const dto = new DeleteFileUploadDto();
        dto.path = imageResource.url;
        await this.uploadService.deleteFileWithCloudinary(dto);
      });
      return await this.imageResourceRepository.remove(imageResources);
    }
  }
}
