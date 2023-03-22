import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums/roles.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TicketGroupService } from './ticket-group.service';
import {
  Get,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import {
  CreateTicketGroupDto,
  UpdateTicketGroupDto,
  DeleteMultiTicketGroupDto,
  FilterTicketGroupDto,
} from './dto';

@Controller('ticket-group')
@ApiTags('Ticket Group')
export class TicketGroupController {
  constructor(private ticketGroupService: TicketGroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createTickerGroup(
    @Body() dto: CreateTicketGroupDto,
    @CurrentUser() user,
  ) {
    return await this.ticketGroupService.createTicketGroup(dto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @CurrentUser() user,
    @Query() dto: FilterTicketGroupDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.ticketGroupService.findAllTicketGroup(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTickerGroupById(@Param('id') id: string, @CurrentUser() user) {
    return await this.ticketGroupService.getTicketGroupById(id, user.id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTickerGroupByCode(@Param('code') code: string, @CurrentUser() user) {
    return await this.ticketGroupService.getTicketGroupByCode(code, user.id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTicketGroupById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTicketGroupDto,
  ) {
    return await this.ticketGroupService.updateTicketGroupById(
      id,
      dto,
      user.id,
    );
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTickerGroupByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateTicketGroupDto,
  ) {
    return await this.ticketGroupService.updateTicketGroupByCode(
      code,
      dto,
      user.id,
    );
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTicketGroupById(@CurrentUser() user, @Param('id') id: string) {
    return await this.ticketGroupService.deleteTicketGroupById(id, user.id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTicketGroupByCode(
    @CurrentUser() user,
    @Param('code') code: string,
  ) {
    return await this.ticketGroupService.deleteTicketGroupByCode(code, user.id);
  }

  @Delete('multiple/ids')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleByIds(
    @CurrentUser() user,
    @Body() dto: DeleteMultiTicketGroupDto,
  ) {
    return await this.ticketGroupService.deleteMultipleTicketGroupsByIds(
      user.id,
      dto,
    );
  }

  @Delete('multiple/codes')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleByCodes(
    @CurrentUser() user,
    @Body() dto: DeleteMultiTicketGroupDto,
  ) {
    return await this.ticketGroupService.deleteMultipleTicketGroupsByCodes(
      user.id,
      dto,
    );
  }
}
