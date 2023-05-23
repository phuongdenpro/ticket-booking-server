import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

@Controller('')
@ApiTags('site')
export class SiteController {
  @Get('.well-known/pki-validation/:file')
  @HttpCode(HttpStatus.OK)
  async getVerifyHttps() {
    const file = await fs.readFileSync(
      './https/A68D48BB107184ABC2B3577736CEFC91.txt',
      'utf-8',
    );
    return {
      isText: true,
      file,
    };
  }
}
