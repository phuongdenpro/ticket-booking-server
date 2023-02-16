import { DeleteFileUploadDto, UploadWithPathUploadDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
    // return this.uploadService.uploadFileWithAWS(file);
    return this.uploadService.uploadFileWithCloudinary(file);
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
    // return this.uploadService.uploadImageWithAWS(file);
    return this.uploadService.uploadImageWithCloudinary(file);
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
    // return this.uploadService.uploadVideoWithAWS(file);
    return this.uploadService.uploadVideoWithCloudinary(file);
  }

  @Post('path')
  @HttpCode(HttpStatus.OK)
  async uploadFileWithPath(@Body() dto: UploadWithPathUploadDto) {
    // return this.uploadService.uploadFileWithPathAWS(path);
    return this.uploadService.uploadFileWithPathCloudinary(dto);
  }

  @Delete('location')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Body() dto: DeleteFileUploadDto) {
    // return this.uploadService.deleteFileWithAWS(path);
    return this.uploadService.deleteFileWithCloudinary(dto);
  }

  @Post('uploadMutiFile')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadfile(
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.uploadService.uploadMutiFile(files);
    
  }
}
