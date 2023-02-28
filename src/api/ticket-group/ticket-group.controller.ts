import { UpdateTicketGroupDto } from './dto/update-ticket-group.dto';
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
  async findAll(
    @Query() dto: FilterTicketGroupDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.ticketGroupService.findAllTicketGroup(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getTickerGroupById(@Param('id') id: string) {
    return await this.ticketGroupService.findOneTicketGroupById(id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStationById(
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

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteTicketGroupById(@CurrentUser() user, @Param('id') id: string) {
    return await this.ticketGroupService.deleteTicketGroupById(id, user.id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultiple(
    @CurrentUser() user,
    @Body() dto: DeleteMultiTicketGroupDto,
  ) {
    return await this.ticketGroupService.deleteMultipleTicketGroups(
      user.id,
      dto,
    );
  }
}
