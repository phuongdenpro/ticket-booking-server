import {
  Customer,
  CustomerGroup,
  CustomerGroupDetail,
  Staff,
} from 'src/database/entities';
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
import { Pagination } from 'src/decorator';

@Injectable()
export class CustomerGroupService {
  constructor(
    @InjectRepository(CustomerGroup)
    private readonly customerGroupRepository: Repository<CustomerGroup>,
    @InjectRepository(CustomerGroupDetail)
    private readonly customerGDRepository: Repository<CustomerGroupDetail>,
    private dataSource: DataSource,
  ) {}

  async createCustomerGroup(dto: SaveCustomerGroupDto, userId: string) {
    const { name, description, note } = dto;

    const customerGroup = new CustomerGroup();
    if (!name) {
      throw new BadRequestException('NAME_IS_REQUIRED');
    }
    customerGroup.name = name;
    customerGroup.description = description;
    customerGroup.note = note;

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    customerGroup.createdBy = adminExist.id;

    const saveCustomerGroup = await this.customerGroupRepository.save(
      customerGroup,
    );
    const { deletedAt, ...newCustomerGroup } = saveCustomerGroup;
    return newCustomerGroup;
  }

  async getCustomerGroupById(id: string) {
    const query = this.customerGroupRepository.createQueryBuilder('q');
    query.where('q.id = :id', { id });

    const dataResult = await query.getOne();

    if (!dataResult) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    return dataResult;
  }

  async findAllCustomerGroup(
    dto: FilterCustomerGroupDto,
    pagination?: Pagination,
  ) {
    const { customerGroupName, sort } = dto;
    const query = this.customerGroupRepository.createQueryBuilder('q');

    if (customerGroupName) {
      query.andWhere('q.name LIKE :customerGroupName', {
        customerGroupName: `%${customerGroupName}%`,
      });
    }

    // get customer groups
    const customerGroups = await query
      .orderBy('q.createdAt', sort)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.clone().getCount();
    // get customer in groups
    // const newCustomerGroup = await customerGroups.map(async (group) => {
    //   const customerGD = await this.dataSource
    //     .getRepository(CustomerGroupDetail)
    //     .find({
    //       where: { customerGroup: { id: group.id } },
    //       relations: ['customer'],
    //       skip: pagination.skip,
    //       take: pagination.take,
    //     });
    //   group['customers'] = customerGD.map((item) => {
    //     const { deletedAt, accessToken, refreshToken, password, ...customer } =
    //       item.customer;
    //     return customer;
    //   });
    //   return group;
    // });

    return {
      dataResult: customerGroups,
      total,
      pagination,
    };
    // }
  }

  async updateCustomerGroupById(
    adminId: string,
    id: string,
    dto: UpdateCustomerGroupDto,
  ) {
    const customerGroup = await this.getCustomerGroupById(id);
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

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    customerGroup.updatedBy = adminExist.id;

    const { deletedAt, ...saveCustomerGroup } =
      await this.customerGroupRepository.save(customerGroup);
    return saveCustomerGroup;
  }

  async deleteCustomerGroupById(adminId: string, id: string) {
    const dataResult = await this.getCustomersByGroupId(
      id,
      adminId,
      undefined,
      {
        page: 1,
        pageSize: 1,
      },
    );
    const customerGroup = dataResult.dataResult;

    if (customerGroup['customers'].length > 0) {
      throw new BadRequestException('CUSTOMER_GROUP_HAS_CUSTOMER');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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

  async getCustomersByGroupId(
    groupId: string,
    adminId: string,
    dto: FilterCustomerDto,
    pagination?: Pagination,
  ) {
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const customerGroup = await this.getCustomerGroupById(groupId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const { customerName, gender, phone, email, sort } = dto;

    const queryCGD = this.customerGDRepository.createQueryBuilder('q1');
    queryCGD.where('q1.customer_group_id = :groupId', {
      groupId,
    });
    if (customerName) {
      queryCGD.andWhere('c.fullName LIKE :customerName', {
        customerName: `%${customerName}%`,
      });
    }
    if (gender) {
      queryCGD.andWhere('c.gender = :gender', { gender });
    }
    if (phone) {
      queryCGD.andWhere('c.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (email) {
      queryCGD.andWhere('c.email LIKE :email', { email: `%${email}%` });
    }

    queryCGD.leftJoinAndSelect('q1.customer', 'c');
    const dataResultGD = await queryCGD
      .select([
        'q1.id',
        'q1.createdAt',
        'c.id',
        'c.isActive',
        'c.phone',
        'c.email',
        'c.fullName',
        'c.gender',
        'c.address',
        'c.note',
        'c.birthday',
        'c.createdAt',
      ])
      .orderBy('q1.createdAt', sort)
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

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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

    const customerGroup = await this.getCustomerGroupById(customerGroupId);
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: adminId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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
