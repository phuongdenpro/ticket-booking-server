import { JwtAuthGuard } from '../../auth/guards';
import { GetPagination, Pagination, Roles } from '../../decorator';
import { RoleEnum } from '../../enums';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import {
  RevenueStatisticsDto,
  StatisticsDto,
  TicketStatisticsDto,
  TopCustomerStatisticsDto,
} from './dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getStatisticsLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getStatisticsLastDays(dto);
  }

  @Get('revenue')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTotalRevenueLastDays(@Query() dto: StatisticsDto) {
    return await this.statisticsService.getTotalRevenueLastDays(dto);
  }

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTotalOrdersLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getTotalOrdersLastDays(dto);
  }

  @Get('tickets')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTotalTicketsSoldLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getTotalTicketsSoldLastDays(dto);
  }

  @Get('customers')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTotalCustomersLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getTotalCustomersLastDays(dto);
  }

  @Get('top-customers')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTopCustomersLastDays(@Query() dto: TopCustomerStatisticsDto) {
    return this.statisticsService.getTopCustomersLastDays(dto);
  }

  @Get('revenue-by-day')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRevenueByDayLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getRevenueByDayLastDays(dto);
  }

  @Get('revenue-by-customer')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRevenueCustomersLastDays(
    @Query() dto: RevenueStatisticsDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.statisticsService.getRevenueCustomers(dto, pagination);
  }
  @Get('revenue-by-employees')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRevenueEmployeesLastDays(
    @Query() dto: RevenueStatisticsDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.statisticsService.getRevenueEmployees(dto, pagination);
  }

  @Get('ticket-sold-by-route')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTicketsSoldByRoute(
    @Query() dto: TicketStatisticsDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.statisticsService.getTicketsSoldByRoute(dto, pagination);
  }

  @Get('promotion-lines')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPromotionLines(
    @Query() dto: RevenueStatisticsDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.statisticsService.getStatisticsPromotionLines(dto, pagination);
  }
}
