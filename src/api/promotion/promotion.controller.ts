import { CreatePromotionDto, UpdatePromotionDto } from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import { CurrentUser, Roles } from './../../decorator';
import { RoleEnum } from './../../enums';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('promotion')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPromotion(@Body() dto: CreatePromotionDto, @CurrentUser() user) {
    return await this.promotionService.createPromotion(dto, user.id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getPromotionByCode(@Param('code') code: string) {
    return await this.promotionService.findOnePromotionByCode(code);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getPromotionById(@Param('id') id: string) {
    return await this.promotionService.findOnePromotionById(id);
  }
}
