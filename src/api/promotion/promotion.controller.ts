import { DeleteMultiPromotionDto } from './dto/delete-multiple-promotion.dto';
import {
  CreatePromotionDto,
  FilterPromotionDto,
  UpdatePromotionDto,
} from './dto';
import { JwtAuthGuard } from './../../auth/guards';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import { DeleteDtoTypeEnum, RoleEnum } from './../../enums';
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
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('promotion')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPromotionStatusEnum() {
    return await this.promotionService.getPromotionStatusEnum();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllPromotion(
    @Query() dto: FilterPromotionDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.promotionService.findAllPromotion(dto, pagination);
  }

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
    return await this.promotionService.getPromotionByCode(code);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getPromotionById(@Param('id') id: string) {
    return await this.promotionService.getPromotionById(id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async UpdatePromotionById(
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.updatePromotionByIdOrCode(
      dto,
      user.id,
      id,
    );
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async UpdatePromotionByCode(
    @Param('code') code: string,
    @Body() dto: UpdatePromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.updatePromotionByIdOrCode(
      dto,
      user.id,
      undefined,
      code,
    );
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePromotionById(@Param('id') id: string, @CurrentUser() user) {
    return await this.promotionService.deletePromotionByIdOrCode(user.id, id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePromotionByCode(
    @Param('code') code: string,
    @CurrentUser() user,
  ) {
    return await this.promotionService.deletePromotionByIdOrCode(
      user.id,
      undefined,
      code,
    );
  }

  @Delete('multiple/ids')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePromotionByIds(
    dto: DeleteMultiPromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.deleteMultiplePromotionByIdsOrCodes(
      dto,
      user.id,
      DeleteDtoTypeEnum.ID,
    );
  }

  @Delete('multiple/codes')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiplePromotionByCodes(
    dto: DeleteMultiPromotionDto,
    @CurrentUser() user,
  ) {
    return await this.promotionService.deleteMultiplePromotionByIdsOrCodes(
      dto,
      user.id,
      DeleteDtoTypeEnum.CODE,
    );
  }
}
