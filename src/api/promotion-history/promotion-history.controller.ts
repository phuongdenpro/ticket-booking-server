import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PromotionHistoryService } from './promotion-history.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('promotion-history')
@ApiTags('Promotion History')
export class PromotionHistoryController {
  constructor(private promotionHistoryService: PromotionHistoryService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPromotionStatusEnum() {
    return await this.promotionHistoryService.getPromotionHistoryStatusEnum();
  }
}
