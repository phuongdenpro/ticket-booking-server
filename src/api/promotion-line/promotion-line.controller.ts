import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromotionLineService } from './promotion-line.service';

@Controller('promotion-line')
@ApiTags('Promotion Line')
export class PromotionLineController {
  constructor(private promotionLineService: PromotionLineService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @Roles(RoleEnum.STAFF)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async createPromotion(@Body() dto: CreatePromotionDto, @CurrentUser() user) {
  //   return await this.promotionLineService.createPromotion(dto, user.id);
  // }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getPromotionByCode(@Param('code') code: string) {
    return await this.promotionLineService.getPromotionLineByCode(code);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getPromotionById(@Param('id') id: string) {
    return await this.promotionLineService.getPromotionLineById(id);
  }
}
