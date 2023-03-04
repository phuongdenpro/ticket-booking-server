import { CreatePromotionDto } from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import { CurrentUser, Roles } from './../../decorator';
import { RoleEnum } from './../../enums';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
  async createPriceList(@Body() dto: CreatePromotionDto, @CurrentUser() user) {
    return await this.promotionService.createPromotion(dto, user.id);
  }
}
