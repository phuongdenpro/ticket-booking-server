import { GenderEnum, SortEnum, UserStatusEnum } from './../../enums';
import { Pagination } from '../../decorator';
import { Customer, CustomerGroup, Staff, Ward } from '../../database/entities';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CreateCustomerForAdminDto,
  FilterCustomerDto,
  UpdateCustomerForAdminDto,
} from './dto';
import { UpdateCustomerDto, UserUpdatePasswordDto } from '../user/dto';
import * as bcrypt from 'bcrypt';
import { AddCustomerDto, RemoveCustomerDto } from '../customer-group/dto';
import { AuthService } from '../../auth/auth.service';
import * as moment from 'moment';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  private selectFieldsWithQ = [
    'u.id',
    'u.lastLogin',
    'u.status',
    'u.phone',
    'u.email',
    'u.fullName',
    'u.gender',
    'u.address',
    'u.fullAddress',
    'u.note',
    'u.birthday',
    'u.createdAt',
    'u.updatedAt',
    'u.updatedBy',
    'cg.id',
    'cg.name',
    'cg.code',
    'cg.description',
    'cg.note',
    'cg.createdBy',
    'cg.createdAt',
    'cg.updatedAt',
  ];

  private selectFieldsAddress = {
    select: {
      ward: {
        id: true,
        name: true,
        type: true,
        codename: true,
        code: true,
        districtCode: true,
        district: {
          id: true,
          name: true,
          type: true,
          codename: true,
          code: true,
          provinceCode: true,
          province: {
            id: true,
            name: true,
            type: true,
            codename: true,
            code: true,
          },
        },
      },
    },
    relations: {
      ward: {
        district: {
          province: true,
        },
      },
    },
  };

  async getCustomerStatus() {
    return Object.keys(UserStatusEnum).map((key) => UserStatusEnum[key]);
  }

  async findOneCustomer(options: any) {
    return await this.customerRepository.findOne({
      where: { ...options?.where },
      select: {
        id: true,
        lastLogin: true,
        status: true,
        phone: true,
        email: true,
        fullName: true,
        gender: true,
        address: true,
        note: true,
        fullAddress: true,
        birthday: true,
        createdAt: true,
        updatedBy: true,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
      },
      relations: {
        customerGroup: true,
        ...options?.relations,
      },
      ...options?.other,
    });
  }

  async findOneByEmail(email: string, options?: any) {
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }
    return await this.findOneCustomer(options);
  }

  async findOneByPhone(phone: string, options?: any) {
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }
    return await this.findOneCustomer(options);
  }

  async findOneById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneCustomer(options);
  }

  async findCustomerByRefreshToken(refreshToken: string, options?: any) {
    if (options) {
      options.where = { refreshToken, ...options?.where };
      options.select = { refreshToken: true, ...options?.select };
    } else {
      options = { where: { refreshToken }, select: { refreshToken: true } };
    }
    return await this.findOneCustomer(options);
  }

  async findAll(dto: FilterCustomerDto, pagination: Pagination) {
    const { keywords, status } = dto;

    const query = this.customerRepository.createQueryBuilder('u');
    if (keywords) {
      query
        .orWhere('u.fullName like :query')
        .orWhere('u.email like :query')
        .orWhere('u.phone like :query')
        .orWhere('u.address like :query')
        .orWhere('u.fullAddress like :query')
        .orWhere('u.note like :query')
        .setParameter('query', `%${keywords}%`);
    }

    if (status) {
      query.andWhere('u.status = :status', { status });
    }
    const total = await query.clone().getCount();

    const dataResult = await query
      .leftJoinAndSelect('u.customerGroup', 'cg')
      .offset(pagination.skip)
      .limit(pagination.take)
      .orderBy('u.createdAt', SortEnum.DESC)
      .select(this.selectFieldsWithQ)
      .getMany();

    return { dataResult, pagination, total };
  }

  async getCustomerByEmail(email: string, options?: any) {
    const userExist = await this.findOneByEmail(email, options);

    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async getCustomerById(id: string, options?: any) {
    const userExist = await this.findOneById(id, options);
    if (!userExist) throw new BadRequestException('USER_NOT_FOUND');
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.getCustomerById(id);
    if (userExist.status == UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const isPasswordMatches = await bcrypt.compare(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    }
    if (dto?.newPassword !== dto?.confirmNewPassword) {
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    }

    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(),
    );
    return await this.customerRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }

  async updateCustomer(
    id: string,
    dto: UpdateCustomerDto,
    userId?: string,
    adminId?: string,
  ) {
    const { fullName, address, gender, birthDate, wardId, wardCode } = dto;
    const admin = await this.dataSource.getRepository(Staff).findOne({
      where: {
        id: adminId || '',
      },
    });
    const customer = await this.findOneById(userId || '');
    if (!customer && !admin) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (
      (userId && customer && customer.status === UserStatusEnum.INACTIVATE) ||
      (adminId && admin && !admin.isActive)
    ) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const oldCustomer = await this.findOneById(id, {
      select: {
        ...this.selectFieldsAddress.select,
      },
      relations: this.selectFieldsAddress.relations,
    });
    if (fullName) {
      oldCustomer.fullName = fullName;
    }
    if (address) {
      oldCustomer.address = address;
    }
    switch (gender) {
      case GenderEnum.MALE:
        oldCustomer.gender = GenderEnum.MALE;
        break;
      case GenderEnum.FEMALE:
        oldCustomer.gender = GenderEnum.FEMALE;
        break;
      case GenderEnum.OTHER:
        oldCustomer.gender = GenderEnum.OTHER;
        break;
      default:
        oldCustomer.gender = GenderEnum.OTHER;
        break;
    }
    if (birthDate) {
      oldCustomer.birthday = birthDate;
    }
    if (wardId) {
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: {
          id: wardId,
        },
        relations: { district: { province: true } },
      });
      if (!ward) {
        throw new NotFoundException('WARD_NOT_FOUND');
      }
      oldCustomer.ward = ward;
    } else if (wardCode) {
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: {
          code: wardCode,
        },
        relations: { district: { province: true } },
      });
      if (!ward) {
        throw new NotFoundException('WARD_NOT_FOUND');
      }
      oldCustomer.ward = ward;
    }
    const district = oldCustomer.ward.district;
    const province = district.province;
    oldCustomer.fullAddress = `${oldCustomer.address}, ${oldCustomer.ward.name}, ${district.name}, ${province.name}`;

    const saveCustomer = await this.customerRepository.save(oldCustomer);
    delete oldCustomer.ward.district;
    delete district.province;
    saveCustomer['district'] = district;
    saveCustomer['province'] = province;
    return saveCustomer;
  }

  async createCustomerForAdmin(userId: string, dto: CreateCustomerForAdminDto) {
    const {
      email,
      fullName,
      wardCode,
      gender,
      birthday,
      phone,
      customerGroupId,
      customerGroupCode,
      address,
      note,
    } = dto;
    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: userId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customer = new Customer();
    customer.fullName = fullName;
    customer.note = note;
    switch (gender) {
      case GenderEnum.FEMALE:
        customer.gender = GenderEnum.FEMALE;
        break;
      case GenderEnum.MALE:
        customer.gender = GenderEnum.MALE;
        break;
      case GenderEnum.OTHER:
        customer.gender = GenderEnum.OTHER;
        break;
      default:
        customer.gender = GenderEnum.OTHER;
        break;
    }
    if (birthday) {
      customer.birthday = birthday;
    } else {
      customer.birthday = new Date(moment().format('YYYY-MM-DD'));
    }

    if (email) {
      const userEmailExist = await this.findOneByEmail(email);
      if (userEmailExist) {
        throw new BadRequestException('EMAIL_ALREADY_EXIST');
      }
      customer.email = email;
    }

    const userPhoneExist = await this.findOneByPhone(phone);
    if (userPhoneExist) {
      throw new BadRequestException('PHONE_ALREADY_EXIST');
    }
    customer.phone = phone;
    const ward = await this.dataSource.getRepository(Ward).findOne({
      where: {
        code: wardCode,
      },
      select: {
        ...this.selectFieldsAddress.select.ward,
      },
      relations: ['district', 'district.province'],
    });
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    customer.ward = ward;
    customer.address = address;
    customer.fullAddress = `${address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
    delete customer.ward.district;

    let customerGroupExist;
    if (customerGroupId) {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { id: customerGroupId },
        });
    } else if (customerGroupCode) {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: customerGroupCode },
        });
    } else {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: 'DEFAULT' },
        });
    }
    if (!customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    customer.customerGroup = customerGroupExist;

    customer.createdBy = adminExist.id;
    customer.status = UserStatusEnum.ACTIVE;
    const saveCustomer = await this.customerRepository.save(customer);
    delete saveCustomer.lastLogin;
    delete saveCustomer.refreshToken;
    delete saveCustomer.accessToken;
    delete saveCustomer.password;
    delete customer.deletedAt;
    return saveCustomer;
  }

  async updateCustomerForAdmin(
    id: string,
    dto: UpdateCustomerForAdminDto,
    userId: string,
  ) {
    const {
      fullName,
      wardCode,
      gender,
      birthday,
      customerGroupId,
      customerGroupCode,
      address,
      status,
      note,
    } = dto;
    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: userId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const customer = await this.findOneById(id, {
      select: {
        ...this.selectFieldsAddress.select,
      },
      relations: this.selectFieldsAddress.relations,
    });
    if (fullName) {
      customer.fullName = fullName;
    }
    if (note) {
      customer.note = note;
    }
    if (gender) {
      switch (gender) {
        case GenderEnum.FEMALE:
          customer.gender = GenderEnum.FEMALE;
          break;
        case GenderEnum.MALE:
          customer.gender = GenderEnum.MALE;
          break;
        case GenderEnum.OTHER:
          customer.gender = GenderEnum.OTHER;
          break;
      }
    }
    if (status) {
      switch (status) {
        case UserStatusEnum.ACTIVE:
          customer.status = UserStatusEnum.ACTIVE;
          break;
        case UserStatusEnum.INACTIVATE:
          customer.status = UserStatusEnum.INACTIVATE;
          break;
        case UserStatusEnum.SUSPENSION:
          customer.status = UserStatusEnum.SUSPENSION;
          break;
      }
    }
    if (birthday) {
      customer.birthday = birthday;
    }
    let customerGroupExist;
    if (customerGroupId) {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { id: customerGroupId },
        });
    } else if (customerGroupCode) {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: customerGroupCode },
        });
    } else {
      customerGroupExist = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: 'DEFAULT' },
        });
    }
    if (!customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }
    customer.customerGroup = customerGroupExist;

    if (address) {
      customer.address = address;
    }
    if (wardCode) {
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: {
          code: wardCode,
        },
        relations: ['district', 'district.province'],
      });
      if (!ward) {
        throw new NotFoundException('WARD_NOT_FOUND');
      }
      customer.ward = ward;
    }
    const district = customer.ward.district;
    const province = district.province;
    customer.fullAddress = `${customer.address}, ${customer.ward.name}, ${district.name}, ${province.name}`;
    customer.updatedBy = adminExist.id;

    const saveCustomer = await this.customerRepository.save(customer);
    delete customer.refreshToken;
    delete customer.accessToken;
    delete customer.deletedAt;
    delete customer.password;
    delete customer.ward.district;
    delete district.province;
    saveCustomer['district'] = district;
    saveCustomer['province'] = province;
    return saveCustomer;
  }

  async addCustomerToCustomerGroup(dto: AddCustomerDto, adminId: string) {
    const { customerId, customerGroupId, customerGroupCode } = dto;
    if (!customerGroupId && !customerGroupCode) {
      throw new BadRequestException(
        'CUSTOMER_GROUP_ID_OR_CUSTOMER_GROUP_CODE_REQUIRED',
      );
    }
    const customer = await this.getCustomerById(customerId);
    if (!customer) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    let customerGroup;
    if (customerGroupId) {
      customerGroup = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { id: customerGroupId },
        });
    } else if (customerGroupCode) {
      customerGroup = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: customerGroupCode },
        });
    }
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customer.customerGroup = customerGroup;
    customer.updatedBy = adminExist.id;
    await this.customerRepository.save(customer);
    return {
      customer: {
        id: customerId,
      },
      customerGroup: {
        id: customerGroupId,
      },
      message: 'Thêm khách hàng vào nhóm thành công',
    };
  }

  async removeCustomerFromCustomerGroup(
    dto: RemoveCustomerDto,
    adminId: string,
  ) {
    const { customerId, customerGroupId, customerGroupCode } = dto;
    if (!customerGroupId && !customerGroupCode) {
      throw new BadRequestException(
        'CUSTOMER_GROUP_ID_OR_CUSTOMER_GROUP_CODE_REQUIRED',
      );
    }
    const customer = await this.getCustomerById(customerId);
    if (!customer) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    let customerGroup;
    if (customerGroupId) {
      customerGroup = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { id: customerGroupId },
        });
    } else if (customerGroupCode) {
      customerGroup = await this.dataSource
        .getRepository(CustomerGroup)
        .findOne({
          where: { code: customerGroupCode },
        });
    }
    if (!customerGroup) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: { id: adminId },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    customer.customerGroup = null;
    customer.updatedBy = adminExist.id;
    await this.customerRepository.save(customer);
    return {
      customer: {
        id: customerId,
      },
      customerGroup: {
        id: customerGroupId,
      },
      message: 'Xoá khách hàng khỏi nhóm thành công',
    };
  }

  async deleteCustomerById(adminId: string, id: string) {
    const customer = await this.getCustomerById(id);
    if (!customer) {
      throw new BadRequestException('CUSTOMER_NOT_FOUND');
    }
    const adminExist = await this.dataSource.getRepository(Staff).findOne({
      where: {
        id: adminId,
      },
    });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    customer.updatedBy = adminExist.id;
    customer.deletedAt = new Date();
    await this.customerRepository.save(customer);
    return {
      id: customer.id,
      message: 'Xoá khách hàng thành công',
    };
  }
}
