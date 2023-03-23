import {
  CurrentUser,
  GetPagination,
  Pagination,
  Role,
  Roles,
} from '../../decorator';
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
import { JwtAuthGuard } from '../../auth/guards';
import { RoleEnum } from '../../enums';

import {
  FilterCustomerDto,
  CreateCustomerForAdminDto,
  UpdateCustomerForAdminDto,
} from './dto';
import { CustomerService } from './customer.service';
import { AddCustomerDto, RemoveCustomerDto } from '../customer-group/dto';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('')
  @Roles(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@CurrentUser() user, @Body() dto: CreateCustomerForAdminDto) {
    return this.customerService.createCustomerForAdmin(user.id, dto);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getCustomerStatus() {
    return this.customerService.getCustomerStatus();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Role(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterCustomerDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.customerService.findAll(dto, pagination);
  }

  @Patch(':id')
  @Role(RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerForAdminDto,
  ) {
    return this.customerService.updateCustomerForAdmin(id, dto, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Role(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findCustomerOneById(@Param('id') id: string) {
    const options = {
      relations: { ward: { district: { province: true } } },
    };
    const customer = await this.customerService.getCustomerById(id, options);
    customer['province'] = customer.ward.district.province;
    delete customer.ward.district.province;
    customer['district'] = customer.ward.district;
    delete customer.ward.district;
    return customer;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Role(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@CurrentUser() user, @Param('id') id: string) {
    return await this.customerService.deleteCustomerById(user.id, id);
  }

  @Post('customer-group/add-customer')
  @HttpCode(HttpStatus.CREATED)
  @Role(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addCustomer(@CurrentUser() user, @Body() dto: AddCustomerDto) {
    return await this.customerService.addCustomerToCustomerGroup(dto, user.id);
  }

  @Delete('customer-group/remove-customer')
  @HttpCode(HttpStatus.OK)
  @Role(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeCustomer(@Body() dto: RemoveCustomerDto, @CurrentUser() user) {
    return await this.customerService.removeCustomerFromCustomerGroup(
      dto,
      user.id,
    );
  }
}
