import { RemoveCustomerDto } from './dto/remove-customer.dto';
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
import { CustomerGroupService } from './customer-group.service';
import {
  SaveCustomerGroupDto,
  AddCustomerDto,
  AddMultiCustomerDto,
  FilterCustomerGroupDto,
  DeleteMultiCustomerGroupDto,
  UpdateCustomerGroupDto,
  RemoveMultiCustomerDto,
  FilterCustomerDto,
} from './dto';
import { CurrentUser, GetPagination, Pagination, Roles } from 'src/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/enums';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('customer-group')
@ApiTags('Customer Group')
export class CustomerGroupController {
  constructor(private customGroupService: CustomerGroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createCustomerGroup(
    @Body() dto: SaveCustomerGroupDto,
    @CurrentUser() user,
  ) {
    return await this.customGroupService.createCustomerGroup(dto, user.id);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCustomerGroup(@Param('id') id: string) {
    return await this.customGroupService.getCustomerGroupById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() dto: FilterCustomerGroupDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.customGroupService.findAllCustomerGroup(dto, pagination);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateCustomerGroupById(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerGroupDto,
  ) {
    return await this.customGroupService.updateCustomerGroupById(
      user.id,
      id,
      dto,
    );
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteCustomerGroupById(@CurrentUser() user, @Param('id') id: string) {
    return await this.customGroupService.deleteCustomerGroupById(user.id, id);
  }

  @Delete('multiple')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleCustomerGroupByIds(
    @CurrentUser() user,
    @Body() dto: DeleteMultiCustomerGroupDto,
  ) {
    return await this.customGroupService.deleteMultipleCustomerGroupByIds(
      user.id,
      dto,
    );
  }

  @Get(':id/customers')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCustomersByGroupId(
    @Param('id') id: string,
    @Query() dto: FilterCustomerDto,
    @CurrentUser() user,
    @GetPagination() pagination?: Pagination,
  ) {
    return await this.customGroupService.getCustomersByGroupId(
      id,
      user.id,
      dto,
      pagination,
    );
  }

  @Post('/add-customer')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addCustomer(@Body() dto: AddCustomerDto, @CurrentUser() user) {
    return await this.customGroupService.addCustomer(dto, user.id);
  }

  @Post('/add-customers')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addCustomers(@Body() dto: AddMultiCustomerDto, @CurrentUser() user) {
    return await this.customGroupService.addCustomers(dto, user.id);
  }

  @Delete('/remove-customer')
  @HttpCode(HttpStatus.NOT_FOUND)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeCustomer(@Body() dto: RemoveCustomerDto, @CurrentUser() user) {
    return await this.customGroupService.removeCustomer(dto, user.id);
  }

  @Delete('/remove-customers')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeCustomers(
    @Body() dto: RemoveMultiCustomerDto,
    @CurrentUser() user,
  ) {
    return await this.customGroupService.removeCustomers(user.id, dto);
  }
}
