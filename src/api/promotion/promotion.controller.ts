import { CreatePromotionDto, UpdatePromotionDto } from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import { CurrentUser, Roles } from './../../decorator';
import { RoleEnum } from './../../enums';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async UpdatePromotionById(
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.updatePromotionById(id, dto, user.id);
  }

  @Patch(':code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async UpdatePromotionByCode(
    @Param('code') code: string,
    @Body() dto: UpdatePromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.updatePromotionByCode(
      code,
      dto,
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePromotionById(@Param('id') id: string, @CurrentUser() user) {
    return await this.promotionService.deletePromotionById(id, user.id);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePromotionByCode(
    @Param('code') code: string,
    @CurrentUser() user,
  ) {
    return await this.promotionService.deletePromotionByCode(code, user.id);
  }
}
