import { AdminService } from './../admin/admin.service';
import { SortEnum } from './../../enums';
import {
  Customer,
  CustomerGroup,
  CustomerGroupDetail,
} from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  SaveCustomerGroupDto,
  AddCustomerDto,
  AddMultiCustomerDto,
  FilterCustomerGroupDto,
  UpdateCustomerGroupDto,
  DeleteMultiCustomerGroupDto,
  RemoveCustomerDto,
  FilterCustomerDto,
  RemoveMultiCustomerDto,
} from './dto';
import { Pagination } from './../../decorator';

@Injectable()
export class CustomerGroupService {
  constructor(
    @InjectRepository(CustomerGroup)
    private readonly customerGroupRepository: Repository<CustomerGroup>,
    @InjectRepository(CustomerGroupDetail)
    private readonly customerGDRepository: Repository<CustomerGroupDetail>,
    private readonly adminService: AdminService,
    private dataSource: DataSource,
  ) {}

  async findOneCustomerGroup(options: any) {
    return await this.customerGroupRepository.findOne({
      where: { ...options?.where },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      ...options?.other,
    });
  }

  async findCustomerGroupByCode(code: string, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneCustomerGroup(options);
  }

  async findCustomerGroupById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneCustomerGroup(options);
  }

  // customer group
  async createCustomerGroup(dto: SaveCustomerGroupDto, adminId: string) {
    const { code, name, description, note } = dto;

    const customerGroupExist = await this.findCustomerGroupByCode(code);
    if (customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_CODE_EXIST');
    }

    const customerGroup = new CustomerGroup();
    if (!name) {
      throw new BadRequestException('NAME_IS_REQUIRED');
    }
    customerGroup.code = code;
    customerGroup.name = name;
    customerGroup.description = description;
    customerGroup.note = note;

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customerGroup.createdBy = adminExist.id;

    const newCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    delete newCustomerGroup.deletedAt;
    return newCustomerGroup;
  }

  async getCustomerGroupById(id: string, adminId: string) {
    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroup = await this.findCustomerGroupById(id);

    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    return customerGroup;
  }

  async getCustomerGroupByCode(code: string, adminId: string) {
    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroup = await this.findCustomerGroupByCode(code);

    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    return customerGroup;
  }

  async findAllCustomerGroup(
    dto: FilterCustomerGroupDto,
    adminId: string,
    pagination?: Pagination,
  ) {
    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const { keywords, sort } = dto;
    const query = this.customerGroupRepository.createQueryBuilder('q');

    if (keywords) {
      query.orWhere('q.code LIKE :customerGroupCode', {
        customerGroupCode: `%${keywords}%`,
      });
      query.orWhere('q.name LIKE :customerGroupName', {
        customerGroupName: `%${keywords}%`,
      });
      query.orWhere('q.description LIKE :customerGroupDescription', {
        customerGroupDescription: `%${keywords}%`,
      });
      query.orWhere('q.note LIKE :customerGroupNote', {
        customerGroupNote: `%${keywords}%`,
      });
    }
    if (sort) {
      query.orderBy('q.createdAt', sort);
    } else {
      query.orderBy('q.createdAt', SortEnum.DESC);
    }

    // get customer groups
    const dataResult = await query
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.clone().getCount();

    return { dataResult, total, pagination };
  }

  async updateCustomerGroupById(
    adminId: string,
    id: string,
    dto: UpdateCustomerGroupDto,
  ) {
    const customerGroup = await this.getCustomerGroupById(id, adminId);
    const { name, description, note } = dto;
    if (name) {
      customerGroup.name = name;
    }
    if (description) {
      customerGroup.description = description;
    }
    if (note) {
      customerGroup.note = note;
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customerGroup.updatedBy = adminExist.id;

    const saveCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    delete saveCustomerGroup.deletedAt;
    return saveCustomerGroup;
  }

  async updateCustomerGroupByCode(
    adminId: string,
    code: string,
    dto: UpdateCustomerGroupDto,
  ) {
    const customerGroup = await this.getCustomerGroupByCode(code, adminId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const { name, description, note } = dto;
    if (name) {
      customerGroup.name = name;
    }
    if (description) {
      customerGroup.description = description;
    }
    if (note) {
      customerGroup.note = note;
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customerGroup.updatedBy = adminExist.id;

    const saveCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    delete saveCustomerGroup.deletedAt;
    return saveCustomerGroup;
  }

  async deleteCustomerGroupById(adminId: string, id: string) {
    const customerGroup = await this.getCustomerGroupById(id, adminId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customerGroup.updatedBy = adminExist.id;
    customerGroup.deletedAt = new Date();
    const saveCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    return {
      id: saveCustomerGroup.id,
      message: 'Xoá nhóm khách hàng thành công',
    };
  }

  async deleteCustomerGroupByCode(adminId: string, code: string) {
    const customerGroup = await this.getCustomerGroupByCode(code, adminId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customerGroup.updatedBy = adminExist.id;
    customerGroup.deletedAt = new Date();
    const saveCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    return {
      id: saveCustomerGroup.id,
      message: 'Xoá nhóm khách hàng thành công',
    };
  }

  async deleteMultipleCustomerGroupByIds(
    adminId: string,
    dto: DeleteMultiCustomerGroupDto,
  ) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => {
          await this.deleteCustomerGroupById(adminId, id);
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleCustomerGroupByCodes(
    adminId: string,
    dto: DeleteMultiCustomerGroupDto,
  ) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (code) => {
          await this.deleteCustomerGroupByCode(adminId, code);
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // customer - customer detail
  async getCustomersByGroupId(
    groupId: string,
    adminId: string,
    dto: FilterCustomerDto,
    pagination?: Pagination,
  ) {
    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroup = await this.getCustomerGroupById(groupId, adminId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const { keywords, gender, sort } = dto;

    const queryCGD = this.customerGDRepository.createQueryBuilder('q1');
    queryCGD.where('q1.customer_group_id = :groupId', {
      groupId,
    });
    if (keywords) {
      queryCGD
        .orWhere('c.fullName LIKE :customerName', {
          customerName: `%${keywords}%`,
        })
        .orWhere('c.phone LIKE :phone', { phone: `%${keywords}%` })
        .orWhere('c.email LIKE :email', { email: `%${keywords}%` });
    }
    if (gender) {
      queryCGD.andWhere('c.gender = :gender', { gender });
    }
    if (sort) {
      queryCGD.orderBy('q1.createdAt', sort);
    } else {
      queryCGD.orderBy('q1.createdAt', SortEnum.DESC);
    }

    queryCGD.leftJoinAndSelect('q1.customer', 'c');
    const dataResultGD = await queryCGD
      .select([
        'q1.id',
        'q1.createdAt',
        'c.id',
        'c.status',
        'c.phone',
        'c.email',
        'c.fullName',
        'c.gender',
        'c.address',
        'c.note',
        'c.birthday',
        'c.createdAt',
      ])
      .take(pagination.take)
      .skip(pagination.skip)
      .getMany();

    customerGroup['customers'] = dataResultGD.map((item) => {
      return { ...item.customer };
    });

    const total = await queryCGD.clone().getCount();
    return { dataResult: customerGroup, pagination, total };
  }

  async addCustomer(dto: AddCustomerDto, adminId: string) {
    const { customerId, customerGroupId } = dto;
    const customerGroupExist = await this.dataSource
      .getRepository(CustomerGroup)
      .findOne({
        where: { id: customerGroupId },
      });
    if (!customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const customer = await this.dataSource.getRepository(Customer).findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException('CUSTOMER_NOT_FOUND');
    }

    const query = this.customerGDRepository.createQueryBuilder('q');
    query
      .where('q.customer_id = :customerId', { customerId: customerId })
      .andWhere('q.customer_group_id = :customerGroupId', {
        customerGroupId,
      });

    const customerGDExist = await query.getOne();
    if (customerGDExist) {
      throw new BadRequestException('CUSTOMER_ALREADY_IN_GROUP');
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroupDetail = new CustomerGroupDetail();
    customerGroupDetail.customer = customer;
    customerGroupDetail.customerGroup = customerGroupExist;
    const saveCGDetail = await this.customerGDRepository.save(
      customerGroupDetail,
    );
    return {
      id: saveCGDetail.id,
      createdAt: saveCGDetail.createdAt,
      updatedAt: saveCGDetail.updatedAt,
      customer: { id: saveCGDetail.customer.id },
      customerGroup: { id: saveCGDetail.customerGroup.id },
    };
  }

  async addCustomers(dto: AddMultiCustomerDto, adminId: string) {
    const { customerIds, customerGroupId } = dto;
    const customerGroupExist = await this.dataSource
      .getRepository(CustomerGroup)
      .findOne({
        where: { id: customerGroupId },
      });
    if (!customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroupDetails = await customerIds.map(async (customerId) => {
      const customer = await this.dataSource.getRepository(Customer).findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new BadRequestException('CUSTOMER_NOT_FOUND');
      }

      const query = this.customerGDRepository.createQueryBuilder('q');
      query
        .where('q.customer_id = :customerId', { customerId: customerId })
        .andWhere('q.customer_group_id = :customerGroupId', {
          customerGroupId,
        });

      const customerGDExist = await query.getOne();
      if (customerGDExist) {
        return {
          customer: { id: customerId },
          message: 'Khách hàng đã tồn tại trong nhóm',
        };
      } else {
        const customerGroupDetail = new CustomerGroupDetail();
        customerGroupDetail.customer = customer;
        customerGroupDetail.customerGroup = customerGroupExist;
        const saveCGDetail = await this.customerGDRepository.save(
          customerGroupDetail,
        );
        return {
          id: saveCGDetail.id,
          createdAt: saveCGDetail.createdAt,
          updatedAt: saveCGDetail.updatedAt,
          customer: { id: saveCGDetail.customer.id },
          customerGroup: { id: saveCGDetail.customerGroup.id },
        };
      }
    });
    return await Promise.all(customerGroupDetails);
  }

  async removeCustomer(dto: RemoveCustomerDto, adminId: string) {
    const { customerId, customerGroupId } = dto;
    const customer = await this.dataSource.getRepository(Customer).findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException('CUSTOMER_NOT_FOUND');
    }

    const customerGroup = await this.getCustomerGroupById(
      customerGroupId,
      adminId,
    );
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.adminService.findOneBydId(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const query = this.customerGDRepository
      .createQueryBuilder('q')
      .where('q.customer_id = :customerId', { customerId })
      .andWhere('q.customer_group_id = :customerGroupId', { customerGroupId });
    const customerGDExist = await query.getOne();
    if (!customerGDExist) {
      throw new BadRequestException('CUSTOMER_NOT_IN_GROUP');
    }

    customerGDExist.deletedAt = new Date();
    const saveCustomer = await this.customerGDRepository.save(customerGDExist);
    return {
      id: saveCustomer.id,
      message: 'Xóa khách hàng khỏi nhóm thành công',
    };
  }

  async removeCustomers(adminId: string, dto: RemoveMultiCustomerDto) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => {
          return await this.removeCustomer(
            {
              customerId: id,
              customerGroupId: dto.customerGroupId,
            },
            adminId,
          );
        }),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
