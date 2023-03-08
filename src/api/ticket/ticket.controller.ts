import { FilterTicketDto, FilterTicketDetailDto } from './dto';
import { GetPagination, Pagination } from './../../decorator';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  // ticket
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @Roles(RoleEnum.STAFF)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async createNewVehicle(@Body() dto: CreateTicketDto, @CurrentUser() user) {
  //   return await this.ticketService.createTicket(dto, user.id);
  // }

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

  // ticket detail
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
