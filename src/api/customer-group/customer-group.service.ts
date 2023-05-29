import { AdminService } from './../admin/admin.service';
import { SortEnum } from './../../enums';
import { CustomerGroup } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SaveCustomerGroupDto,
  FilterCustomerGroupDto,
  UpdateCustomerGroupDto,
  DeleteMultiCustomerGroupDto,
  FilterCustomerDto,
} from './dto';
import { Pagination } from './../../decorator';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class CustomerGroupService {
  constructor(
    @InjectRepository(CustomerGroup)
    private readonly customerGroupRepository: Repository<CustomerGroup>,
    private readonly adminService: AdminService,
    private readonly customerService: CustomerService,
  ) {}

  async findOneCustomerGroup(options: any) {
    return await this.customerGroupRepository.findOne({
      where: { ...options?.where },
      relations: {
        ...options?.relations,
      },
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

    const adminExist = await this.adminService.findOneById(adminId);
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

  async getCustomerGroupById(id: string, adminId: string, options?: any) {
    const adminExist = await this.adminService.findOneById(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroup = await this.findCustomerGroupById(id, options);

    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    return customerGroup;
  }

  async getCustomerGroupByCode(code: string, adminId: string, options?: any) {
    const adminExist = await this.adminService.findOneById(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customerGroup = await this.findCustomerGroupByCode(code, options);

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
    const adminExist = await this.adminService.findOneById(adminId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    const { keywords, sort } = dto;
    const query = this.customerGroupRepository.createQueryBuilder('q');

    if (keywords) {
      const newKeywords = keywords.trim();
      const subQuery = this.customerGroupRepository
        .createQueryBuilder('q2')
        .where('q2.code LIKE :code', { code: `%${newKeywords}%` })
        .orWhere('q2.name LIKE :name', { name: `%${newKeywords}%` })
        .orWhere('q2.description LIKE :description', {
          description: `%${newKeywords}%`,
        })
        .orWhere('q2.note LIKE :note', { note: `%${newKeywords}%` })
        .select('q2.id')
        .getQuery();

      query.andWhere(`q.id in (${subQuery})`, {
        code: `%${newKeywords}%`,
        name: `%${newKeywords}%`,
        description: `%${newKeywords}%`,
        note: `%${newKeywords}%`,
      });
    }
    query
      .orderBy('q.createdAt', sort || SortEnum.DESC)
      .addOrderBy('q.code', SortEnum.ASC)
      .addOrderBy('q.name', SortEnum.ASC);

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

    const adminExist = await this.adminService.findOneById(adminId);
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

    const adminExist = await this.adminService.findOneById(adminId);
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
    const customerGroup = await this.getCustomerGroupById(id, adminId, {
      relations: ['customers'],
    });
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    if (customerGroup.customers.length > 0) {
      throw new BadRequestException('CUSTOMER_GROUP_HAS_CUSTOMERS');
    }

    const adminExist = await this.adminService.findOneById(adminId);
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
    if (customerGroup.customers.length > 0) {
      throw new BadRequestException('CUSTOMER_GROUP_HAS_CUSTOMERS');
    }

    const adminExist = await this.adminService.findOneById(adminId);
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
    const adminExist = await this.adminService.findOneById(adminId);
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

    const query = this.customerGroupRepository.createQueryBuilder('q');
    query.where('q.id = :groupId', { groupId });
    query.leftJoinAndSelect('q.customers', 'c');

    if (keywords) {
      query
        .orWhere('c.fullName LIKE :fullName', { fullName: `%${keywords}%` })
        .orWhere('c.phone LIKE :phone', { phone: `%${keywords}%` })
        .orWhere('c.email LIKE :email', { email: `%${keywords}%` })
        .orWhere('c.address LIKE :address', { address: `%${keywords}%` })
        .orWhere('c.fullAddress LIKE :fullAddress', {
          fullAddress: `%${keywords}%`,
        });
    }

    if (gender) {
      query.andWhere('c.gender = :gender', { gender });
    }
    if (sort) {
      query
        .orderBy('c.fullName', SortEnum.ASC)
        .orderBy('c.email', sort)
        .orderBy('c.phone', sort)
        .addOrderBy('c.createdAt', sort);
    } else {
      query
        .orderBy('c.fullName', SortEnum.ASC)
        .orderBy('c.email', SortEnum.ASC)
        .orderBy('c.phone', SortEnum.ASC)
        .addOrderBy('c.createdAt', SortEnum.DESC);
    }
    const dataResult = await query
      .select([
        'q.id',
        'q.name',
        'q.code',
        'q.description',
        'q.note',
        'q.createdAt',
        'q.createdBy',
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
      .getOne();

    const total = await query.clone().getCount();
    return { dataResult, pagination, total };
  }
}
