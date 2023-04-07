import { JwtAuthGuard } from './../../auth/guards';
import { DeleteDtoTypeEnum, RoleEnum } from './../../enums';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PromotionLineService } from './promotion-line.service';
import {
  CreatePromotionLinesDto,
  DeleteMultiPromotionLineDto,
  FilterAvailablePromotionLineDto,
  FilterPromotionLineDto,
  UpdatePromotionLineDto,
} from './dto';

@Controller('promotion-line')
@ApiTags('Promotion Line')
export class PromotionLineController {
  constructor(private promotionLineService: PromotionLineService) {}

  @Get('type')
  @HttpCode(HttpStatus.OK)
  async getPromotionLineTypeEnum() {
    return await this.promotionLineService.getPromotionLineTypeEnum();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPromotion(
    @Body() dto: CreatePromotionLinesDto,
    @CurrentUser() user,
  ) {
    return await this.promotionLineService.createPromotionLines(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPriceList(
    @Query() dto: FilterPromotionLineDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.promotionLineService.findAllPromotionLine(
      dto,
      pagination,
    );
  }

  @Get('/available')
  @HttpCode(HttpStatus.OK)
  async findAvailablePromotionLine(
    @Query() dto: FilterAvailablePromotionLineDto,
  ) {
    return await this.promotionLineService.findAvailablePromotionLine(dto);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async UpdatePromotionLineById(
    @Param('id') id: string,
    @Body() dto: UpdatePromotionLineDto,
    @CurrentUser() user,
  ) {
    return await this.promotionLineService.updatePromotionLineByIdOrCode(
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
  async UpdatePromotionLineByCode(
    @Param('code') code: string,
    @Body() dto: UpdatePromotionLineDto,
    @CurrentUser() user,
  ) {
    return await this.promotionLineService.updatePromotionLineByIdOrCode(
      dto,
      user.id,
      undefined,
      code,
    );
  }

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

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePromotionById(@Param('id') id: string, @CurrentUser() user) {
    return await this.promotionLineService.deletePromotionLineByIdOrCode(
      user.id,
      id,
    );
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
    return await this.promotionLineService.deletePromotionLineByIdOrCode(
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
    @Body() dto: DeleteMultiPromotionLineDto,
    @CurrentUser() user,
  ) {
    return await this.promotionLineService.deleteMultiPromotionLineByIdOrCode(
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
    @Body() dto: DeleteMultiPromotionLineDto,
    @CurrentUser() user,
  ) {
    return await this.promotionLineService.deleteMultiPromotionLineByIdOrCode(
      dto,
      user.id,
      DeleteDtoTypeEnum.CODE,
    );
  }
}
