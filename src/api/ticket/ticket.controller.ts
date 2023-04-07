import { JwtAuthGuard } from './../../auth/guards';
import { RoleEnum } from './../../enums';
import { FilterTicketDto, UpdateTicketDto, FilterTicketDetailDto } from './dto';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllTicket(
    @Query() dto: FilterTicketDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.ticketService.findAllTicket(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getTicketById(@Param('id') id: string) {
    return await this.ticketService.getTicketById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getTicketByCode(@Param('code') code: string) {
    return await this.ticketService.getTicketByCode(code);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripDetailById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return await this.ticketService.updateTicketByIdOrCode(dto, id, user.id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTripDetailByCode(
    @CurrentUser() user,
    @Param('code') code: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return await this.ticketService.updateTicketByIdOrCode(dto, code, user.id);
  }

  // ticket detail
  @Get('ticket-detail/status')
  @HttpCode(HttpStatus.OK)
  async getPromotionStatusEnum() {
    return await this.ticketService.getTicketDetailStatus();
  }

  @Get('ticket-detail')
  @HttpCode(HttpStatus.OK)
  async findAllTicketDetail(
    @Query() dto: FilterTicketDetailDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.ticketService.findAllTicketDetail(dto, pagination);
  }

  @Get('ticket-detail/id/:id')
  @HttpCode(HttpStatus.OK)
  async getTicketDetailById(@Param('id') id: string) {
    return await this.ticketService.getTicketDetailById(id);
  }

  @Get('ticket-detail/code/:code')
  @HttpCode(HttpStatus.OK)
  async getTicketDetailByCode(@Param('code') code: string) {
    return await this.ticketService.getTicketDetailByCode(code);
  }
}
