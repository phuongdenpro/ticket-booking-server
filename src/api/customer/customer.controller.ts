import { GetPagination, Pagination, Roles } from '../../decorator';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import { RoleEnum } from '../../enums';

import { FilterCustomerDto } from './dto';
import { CustomerService } from './customer.service';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getCustomerStatus() {
    return this.customerService.getCustomerStatus();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterCustomerDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.customerService.findAll(dto, pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findCustomerOneById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.customerService.findCustomerById(id);
  }
}
