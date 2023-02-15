import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageResource, Vehicle, Station } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { IMAGE_REGEX } from 'src/utils';

@Injectable()
export class ImageResourceService {
  constructor(
    @InjectRepository(ImageResource)
    private readonly imageResourceService: Repository<ImageResource>,
    private dataSource: DataSource,
  ) {}

  async saveImageResource(
    imageResource: ImageResource,
    userId: string,
    vehicleId?: string,
    stationId?: string,
  ) {
    const { url } = imageResource;

    if (url.match(IMAGE_REGEX)) {
      imageResource.url = url;
    } else {
      throw new Error('Invalid image url');
    }
    if (vehicleId) {
      const vehicle = await this.dataSource
        .getRepository(Vehicle)
        .findOne({ where: { id: vehicleId } });
      imageResource.vehicle = vehicle;
    }
    if (stationId) {
      const station = await this.dataSource
        .getRepository(Station)
        .findOne({ where: { id: stationId } });
      imageResource.station = station;
    }
    if (!vehicleId && !stationId) {
      throw new Error('Invalid image resource');
    }
    if (imageResource.isDeleted) {
      imageResource.deletedAt = new Date();
    } else {
      imageResource.deletedAt = null;
    }
    return await this.imageResourceService.save(imageResource);
  }
}
