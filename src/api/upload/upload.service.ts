import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as PATH from 'path';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

import { ConfigService } from '@nestjs/config';

import { IMAGE_REGEX, VIDEO_REGEX } from 'src/utils';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  private bucket_region: string | undefined = this.configService.get<string>(
    'AWS_S3_BUCKET_REGION',
  );
  private bucket_name: string =
    this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
  private folder_name: string =
    this.configService.get<string>('AWS_S3_FOLDER_NAME') || '';
  private access_key_id: string =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private secret_access_key: string = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );
  private MAX_FILE_SIZE: number =
    this.configService.get<number>('MAX_FILE_SIZE');
  private aws_base_url: string = this.configService.get<string>('AWS_BASE_URL');

  private s3 = new S3({
    apiVersion: '2006-03-01',
    region: this.bucket_region,
    accessKeyId: this.access_key_id,
    secretAccessKey: this.secret_access_key
  });

  async uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    console.log(fileName);
    
    const params: S3.PutObjectRequest = {
      Bucket: this.bucket_name,
      Key: `${this.folder_name}/${fileName}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };
    try {
      const { Location } = await this.s3.upload(params).promise();
      return { Location };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(IMAGE_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_IMAGE');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    return await this.uploadFile(file);
  }

  async uploadVideo(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(VIDEO_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_VIDEO');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }

    return await this.uploadFile(file);
  }

  async uploadFileWithPath(path: string) {
    try {
      const fileName = `${new Date().getTime()}_${PATH.basename(path)}`;
      let file = fs.readFileSync(path);
      const params: S3.PutObjectRequest = {
        Bucket: this.bucket_name,
        Key: `${this.folder_name}/${fileName}`,
        Body: file,
        ACL: 'public-read',
      };

      const res = await this.s3.upload(params).promise();
      if (res.Location) {
        // remove file
        fs.unlinkSync(path);
      }
      return { Location: res.Location };
    } catch (error) {
      return null;
    }
  }

  async deleteFile(path: string) {
    const imageName = path.replace(this.aws_base_url, '');
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucket_name,
          Key: `${this.folder_name}/${imageName}`,
        })
        .promise();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
