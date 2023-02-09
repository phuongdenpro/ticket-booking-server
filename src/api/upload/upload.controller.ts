import { JwtAuthGuard } from 'src/auth/guards';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('file')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFileWithAWS(file);
  }

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImageWithAWS(file);
  }

  @Post('video')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fields: 1 } }))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadVideoWithAWS(file);
  }

  @Post('path')
  @HttpCode(HttpStatus.OK)
  async uploadFileWithPath(@Body() path: string) {
    return this.uploadService.uploadFileWithPathAWS(path);
  }

  @Delete('location')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Body() path: string) {
    return this.uploadService.deleteFileWithAWS(path);
  }
}
