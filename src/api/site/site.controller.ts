import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

@Controller('')
export class SiteController {
  @Get('.well-known/pki-validation/:file')
  @HttpCode(HttpStatus.OK)
  async getOrderStatus() {
    const file = await fs.readFileSync('./https/A68D48BB107184ABC2B3577736CEFC91.txt', 'utf-8');
    return file;
  }
}
