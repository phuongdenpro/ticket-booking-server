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
import { FilterCustomerDto, UpdateCustomerDto } from './dto';
import { UserUpdatePasswordDto } from '../user/dto';
import * as bcrypt from 'bcrypt';
import { AddCustomerDto, RemoveCustomerDto } from '../customer-group/dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthService } from '../../auth/auth.service';
import { District } from '../../database/entities/vi-address-district.entities';
import { Province } from '../../database/entities/vi-address-provide.entities';

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

  async create(userId: string, dto: CreateCustomerDto) {
    const {
      email,
      fullName,
      wardCode,
      gender,
      birthday,
      phone,
      customerGroupId,
      address,
    } = dto;

    if (email) {
      const userEmailExist = await this.findOneByEmail(email);
      if (userEmailExist) {
        throw new BadRequestException('EMAIL_ALREADY_EXIST');
      }
    }

    const userPhoneExist = await this.findOneByPhone(phone);
    if (userPhoneExist) {
      throw new BadRequestException('PHONE_ALREADY_EXIST');
    }
    const ward = await this.dataSource.getRepository(Ward).findOne({
      where: {
        code: wardCode,
      },
      select: {
        id: true,
        name: true,
        type: true,
        codename: true,
        code: true,
        districtCode: true,
      },
    });
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }

    const customerGroupExist = await this.dataSource
      .getRepository(CustomerGroup)
      .findOne({
        where: {
          id: customerGroupId,
        },
      });
    if (!customerGroupExist) {
      throw new BadRequestException('CUSTOMER_GROUP_NOT_FOUND');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = new Customer();

      user.fullName = fullName;
      user.phone = phone;
      user.address = address;
      user.email = email;
      user.ward = ward;
      user.customerGroup = customerGroupExist;
      if (dto?.password) {
        const passwordHashed = await this.authService.hashData(dto?.password);
        user.password = passwordHashed;
      }
      if (!gender) {
        user.gender = GenderEnum.OTHER;
      } else {
        user.gender = gender;
      }
      if (birthday) {
        user.birthday = birthday;
      } else {
        user.birthday = new Date('01-01-1970');
      }
      user.status = 0;
      const district = await this.dataSource.getRepository(District).findOne({
        where: {
          code: user.ward.districtCode,
        },
        select: {
          id: true,
          name: true,
          type: true,
          codename: true,
          code: true,
          provinceCode: true,
        },
      });
      const province = await await this.dataSource
        .getRepository(Province)
        .findOne({
          where: {
            code: district.provinceCode,
          },
          select: {
            id: true,
            name: true,
            type: true,
            codename: true,
            code: true,
          },
        });
      user.fullAddress = `${user.address}, ${user.ward.name}, ${district.name}, ${province.name}`;
      await queryRunner.commitTransaction();
      // save and select return fields
      const saveUser = await this.customerRepository.save(user);
      delete saveUser.createdAt;
      delete saveUser.updatedAt;
      delete saveUser.deletedAt;
      delete saveUser.updatedBy;
      delete saveUser.password;
      delete saveUser.refreshToken;
      delete saveUser.accessToken;

      return saveUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
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
        fullAddress: true,
        note: true,
        birthday: true,
        createdAt: true,
        updatedBy: true,
        ...options?.select,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.order,
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
    console.log(status);
    
    const query = this.customerRepository.createQueryBuilder('u');
    if (keywords) {
      query
        .orWhere('u.fullName like :query')
        .orWhere('u.email like :query')
        .orWhere('u.phone like :query')
        .orWhere('u.address like :query')
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
    if (userExist.status == 0) {
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
      (userId && customer && customer.status === 0) ||
      (adminId && admin && !admin.isActive)
    ) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    const oldCustomer = await this.findOneById(id, {
      select: {
        ward: {
          id: true,
          name: true,
          type: true,
          codename: true,
          code: true,
          districtCode: true,
          createdBy: false,
          updatedBy: false,
          createdAt: false,
          updatedAt: false,
          district: {
            id: true,
            name: true,
            type: true,
            codename: true,
            code: true,
            provinceCode: true,
            createdBy: false,
            updatedBy: false,
            createdAt: false,
            updatedAt: false,
            province: {
              id: true,
              name: true,
              type: true,
              codename: true,
              code: true,
              createdBy: false,
              updatedBy: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
      },
      relations: ['ward', 'ward.district', 'ward.district.province'],
    });
    if (fullName) {
      oldCustomer.fullName = fullName;
    }
    if (address) {
      oldCustomer.address = address;
    }
    if (gender) {
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
    }
    if (birthDate) {
      oldCustomer.birthday = birthDate;
    }
    if (wardId) {
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: {
          id: wardId,
        },
        relations: ['district', 'district.province'],
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
        relations: ['district', 'district.province'],
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

  async getCustomerStatus() {
    return Object.keys(UserStatusEnum).map((key) => UserStatusEnum[key]);
  }
}
