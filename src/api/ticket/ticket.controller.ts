import { FilterTicketDto } from './dto';
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
  async findAll(
    @Query() dto: FilterTicketDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.ticketService.findAllTicket(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getTripById(@Param('id') id: string) {
    return await this.ticketService.getTicketById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getTripByCode(@Param('code') code: string) {
    return await this.ticketService.getTicketByCode(code);
  }
}
