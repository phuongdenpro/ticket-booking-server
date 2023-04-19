import { JwtAuthGuard } from '../../auth/guards';
import { Roles } from '../../decorator';
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
import { StatisticsDto } from './dto';

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
  async getTotalOrdersLastDays(@Query() dto: StatisticsDto) {
    return this.statisticsService.getTotalOrdersLastDays(dto);
  }
}
