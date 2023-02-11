import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { ImageResourceService } from '../image-resource/image-resource.service';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly vehicleService: Repository<Trip>,
    private imageResourceService: ImageResourceService,
    private dataSource: DataSource,
  ) {}
}
