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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private userService: CustomerService) {}

  @Get()
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterCustomerDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.userService.findAll(dto, pagination);
  }

  @Get(':id')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findCustomerOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }
}
