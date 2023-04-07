import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { CurrentUser, Roles } from './../../decorator';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromotionHistoryService } from './promotion-history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CalculatePromotionLineDto } from './dto';

@Controller('promotion-history')
@ApiTags('Promotion History')
export class PromotionHistoryController {
  constructor(private promotionHistoryService: PromotionHistoryService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPromotionStatusEnum() {
    return await this.promotionHistoryService.getPromotionHistoryStatusEnum();
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPromotionHistoryById(@Param('id') id: string) {
    return await this.promotionHistoryService.getPromotionHistoryById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPromotionHistoryByCode(@Param('code') code: string) {
    return await this.promotionHistoryService.getPromotionHistoryByCode(code);
  }

  @Get('order-code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPromotionHistoryByOrderCode(@Param('code') code: string) {
    return await this.promotionHistoryService.getPromotionHistoryByOrderCode(
      code,
    );
  }

  @Get('calculate-promotion-line')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF, RoleEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async calculatePromotionLine(
    @CurrentUser() user,
    @Query() dto: CalculatePromotionLineDto,
  ) {
    return await this.promotionHistoryService.calculatePromotionLine(
      dto,
      user.id,
    );
  }
}
