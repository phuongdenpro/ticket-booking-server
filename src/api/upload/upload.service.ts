import { BadRequestException, Injectable } from '@nestjs/common';
import * as PATH from 'path';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

import { ConfigService } from '@nestjs/config';

import { IMAGE_REGEX, VIDEO_REGEX } from 'src/utils';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';

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
  private cloudinary_base_url: string = this.configService.get<string>(
    'CLOUDINARY_BASE_URL',
  );
  private cloudinary_name: string = this.configService.get<string>(
    'CLOUDINARY_CLOUD_NAME',
  );
  private cloudinary_api_key: string =
    this.configService.get<string>('CLOUDINARY_API_KEY');
  private cloudinary_api_secret: string = this.configService.get<string>(
    'CLOUDINARY_API_SECRET',
  );

  private s3 = new S3({
    apiVersion: '2006-03-01',
    region: this.bucket_region,
    accessKeyId: this.access_key_id,
    secretAccessKey: this.secret_access_key,
  });
  // aws

  async uploadFileWithAWS(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    const fileName = `${new Date().getTime()}_${file.originalname}`;

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

  async uploadImageWithAWS(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(IMAGE_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_IMAGE');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    return await this.uploadFileWithAWS(file);
  }

  async uploadVideoWithAWS(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(VIDEO_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_VIDEO');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }

    return await this.uploadFileWithAWS(file);
  }

  async uploadFileWithPathAWS(path: string) {
    try {
      const fileName = `${new Date().getTime()}_${PATH.basename(path)}`;
      const file = fs.readFileSync(path);
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

  async deleteFileWithAWS(path: string) {
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

  // Cloudinary
  async uploadFileWithCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    v2.config({
      cloud_name: this.cloudinary_name,
      api_key: this.cloudinary_api_key,
      api_secret: this.cloudinary_api_secret,
    });
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageWithCloudinary(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(IMAGE_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_IMAGE');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }
    return await this.uploadFileWithCloudinary(file);
  }

  async uploadVideoWithCloudinary(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('FILE_NOT_FOUND');

    if (!file.mimetype.match(VIDEO_REGEX)) {
      throw new BadRequestException('INVALID_FORMAT_VIDEO');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('MAX_SIZE_WARNING');
    }

    return await this.uploadFileWithAWS(file);
  }

  async deleteFileWithCloudinary(path: string) {
    // delete file in cloudinary with url
    const imageName = path.replace(this.cloudinary_base_url, '');
    try {
      v2.config({
        cloud_name: this.cloudinary_name,
        api_key: this.cloudinary_api_key,
        api_secret: this.cloudinary_api_secret,
      });
      await v2.uploader.destroy(imageName);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
