import { Pagination } from './../../decorator';
import { AuthService } from './../../auth/auth.service';
import { EMAIL_REGEX, PHONE_REGEX, generatePassword } from './../../utils';
import {
  SortEnum,
  GenderEnum,
  AdminRolesStringEnum,
  ActiveStatusEnum,
} from './../../enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, Ward } from './../../database/entities';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateStaffDto, FilterAllStaffDto, UpdateStaffDto } from './dto';
import { generateStaffCode } from 'src/utils';
import * as moment from 'moment';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  private selectFields = [
    'q.id',
    'q.lastLogin',
    'q.isActive',
    'q.code',
    'q.phone',
    'q.email',
    'q.fullName',
    'q.gender',
    'q.address',
    'q.fullAddress',
    'q.note',
    'q.birthDay',
    'q.isManage',
    'q.createdAt',
  ];

  async getAdminRoles(userId: string) {
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }

    return {
      dataResult: Object.keys(AdminRolesStringEnum).map(
        (key) => AdminRolesStringEnum[key],
      ),
    };
  }

  async findOneStaff(options: any) {
    return await this.staffRepository.findOne({
      where: { ...options?.where },
      select: {
        id: true,
        lastLogin: true,
        isActive: true,
        phone: true,
        email: true,
        fullName: true,
        gender: true,
        address: true,
        fullAddress: true,
        note: true,
        birthDay: true,
        code: true,
        createdAt: true,
        isManage: true,
        ward: {
          id: true,
          name: true,
          code: true,
          district: {
            id: true,
            name: true,
            code: true,
            province: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        ...options?.select,
      },
      relations: {
        ward: {
          district: {
            province: true,
          },
        },
        ...options?.relations,
      },
      ...options?.other,
    });
  }

  async findOneStaffByCode(code: string, options?: any) {
    if (!code) {
      throw new BadRequestException('CODE_REQUIRED');
    }
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneStaff(options);
  }

  async findOneStaffById(id: string, options?: any) {
    if (!id) {
      throw new BadRequestException('ID_REQUIRED');
    }
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneStaff(options);
  }

  async findOneStaffByPhone(phone: string, options?: any) {
    if (!phone) {
      throw new BadRequestException('PHONE_REQUIRED');
    }
    if (options) {
      options.where = { phone, ...options?.where };
    } else {
      options = { where: { phone } };
    }
    return await this.findOneStaff(options);
  }

  async findOneStaffByEmail(email: string, options?: any) {
    if (!email) {
      throw new BadRequestException('EMAIL_REQUIRED');
    }
    if (options) {
      options.where = { email, ...options?.where };
    } else {
      options = { where: { email } };
    }
    return await this.findOneStaff(options);
  }

  async getStaffByCode(code: string, options?: any) {
    const staff = await this.findOneStaffByCode(code, options);
    if (!staff) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return staff;
  }

  async getStaffById(id: string, options?: any) {
    const staff = await this.findOneStaffById(id, options);
    if (!staff) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return staff;
  }

  async getStaffByPhone(phone: string, options?: any) {
    const staff = await this.findOneStaffByPhone(phone, options);
    if (!staff) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return staff;
  }

  async getStaffByEmail(email: string, options?: any) {
    const staff = await this.findOneStaffByEmail(email, options);
    if (!staff) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return staff;
  }

  async getStaffForAdminByCode(code: string, userId: string, options?: any) {
    if (!userId) {
      throw new BadRequestException('ID_REQUIRED');
    }
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }

    const staff = await this.findOneStaffByCode(code, options);
    if (!staff) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return staff;
  }

  async findAllStaff(
    dto: FilterAllStaffDto,
    userId: string,
    pagination?: Pagination,
  ) {
    if (!userId) {
      throw new BadRequestException('ID_REQUIRED');
    }
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }

    const query = this.staffRepository.createQueryBuilder('q');

    const { keyword, gender, isManage, sort } = dto;
    if (keyword) {
      const newKeywords = keyword.trim();
      const subQuery = this.staffRepository
        .createQueryBuilder('q2')
        .where('q2.code like :code', { code: `%${newKeywords}%` })
        .orWhere('q2.email like :email', { email: `%${newKeywords}%` })
        .orWhere('q2.phone like :phone', { phone: `%${newKeywords}%` })
        .orWhere('q2.fullName like :fullName', {
          fullName: `%${newKeywords}%`,
        })
        .select('q2.id')
        .getQuery();

      query.andWhere(`q.id in (${subQuery})`, {
        code: `%${newKeywords}%`,
        email: `%${newKeywords}%`,
        phone: `%${newKeywords}%`,
        fullName: `%${newKeywords}%`,
      });
    }

    switch (gender) {
      case GenderEnum.FEMALE:
      case GenderEnum.MALE:
      case GenderEnum.OTHER:
        query.andWhere('q.gender = :gender', { gender });
        break;
    }

    switch (isManage) {
      case AdminRolesStringEnum.STAFF:
        query.andWhere('q.isManage = :isManage', { isManage: false });
      case AdminRolesStringEnum.MANAGER:
        query.andWhere('q.isManage = :isManage', { isManage: true });
        break;
    }

    query
      .orderBy('q.createdAt', sort || SortEnum.DESC)
      .addOrderBy('q.code', SortEnum.ASC)
      .addOrderBy('q.email', SortEnum.ASC)
      .addOrderBy('q.phone', SortEnum.ASC)
      .addOrderBy('q.fullName', SortEnum.ASC);

    const dataResult = await query
      // .leftJoinAndSelect('q.ward', 'w')
      // .leftJoinAndSelect('w.district', 'd')
      // .leftJoinAndSelect('d.province', 'p')
      .select(this.selectFields)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();

    const total = await query.clone().getCount();
    return { dataResult, pagination, total };
  }

  async createStaff(dto: CreateStaffDto, userId: string) {
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }

    const {
      phone,
      email,
      fullName,
      gender,
      address,
      wardCode,
      birthDay,
      isManage,
      note,
    } = dto;

    if (!phone.match(PHONE_REGEX)) {
      throw new BadRequestException('INVALID_PHONE_NUMBER');
    }
    const staffExistPhone = await this.findOneStaffByPhone(phone);
    if (staffExistPhone) {
      throw new BadRequestException('PHONE_ALREADY_EXIST');
    }

    if (!email.match(EMAIL_REGEX)) {
      throw new BadRequestException('INVALID_EMAIL');
    }
    const staffExistEmail = await this.findOneStaffByEmail(email);
    if (staffExistEmail) {
      throw new BadRequestException('EMAIL_ALREADY_EXIST');
    }
    let newFullName = fullName.trim();
    if (!newFullName) {
      throw new BadRequestException('FULL_NAME_IS_REQUIRED');
    }

    let code = generateStaffCode();
    let flag = true;
    while (flag) {
      const customerExist = await this.findOneStaffByCode(code);
      if (!customerExist) {
        flag = false;
      } else {
        code = generateStaffCode();
      }
    }
    const staff = new Staff();
    staff.code = code;
    staff.phone = phone;
    staff.email = email;
    staff.fullName = newFullName;

    switch (gender) {
      case GenderEnum.FEMALE:
      case GenderEnum.MALE:
      case GenderEnum.OTHER:
        staff.gender = gender;
        break;
      default:
        staff.gender = GenderEnum.OTHER;
        break;
    }

    if (address) {
      staff.address = address.trim();
    } else {
      staff.address = 'Không xác định';
    }

    const ward = await this.dataSource.getRepository(Ward).findOne({
      where: { code: wardCode ? wardCode : 0 },
      relations: { district: { province: true } },
    });
    staff.ward = ward;
    if (ward) {
      staff.fullAddress = `${staff.address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
    } else {
      staff.fullAddress = 'Không xác định';
    }

    if (birthDay) {
      const currentDate = moment().startOf('day').add(7, 'hour').toDate();
      const newBirthDay = moment(birthDay)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      if (newBirthDay >= currentDate) {
        throw new BadRequestException('BIRTHDAY_NOT_MORE_THAN_CURRENT_DATE');
      }
      staff.birthDay = newBirthDay;
    } else {
      staff.birthDay = moment('1970-01-01')
        .startOf('day')
        .add(7, 'hour')
        .toDate();
    }

    switch (isManage) {
      case AdminRolesStringEnum.STAFF:
        staff.isManage = false;
        break;
      case AdminRolesStringEnum.MANAGER:
        staff.isManage = true;
        break;
      default:
        staff.isManage = false;
        break;
    }

    if (note) {
      staff.note = note.trim();
    }
    staff.isFirstLogin = true;
    staff.createdBy = userId;
    const password = generatePassword();
    const passwordHashed = await this.authService.hashData(password);
    staff.password = passwordHashed;
    await this.authService.sendPasswordToEmail(email, password);

    const saveStaff = await this.staffRepository.save(staff);
    delete saveStaff.password;
    delete saveStaff.refreshToken;
    delete saveStaff.accessToken;
    delete saveStaff.otpCode;
    delete saveStaff.otpExpired;
    delete saveStaff.noteStatus;
    delete saveStaff.deletedAt;
    return saveStaff;
  }

  async updateStaffForAdmin(dto: UpdateStaffDto, userId: string, code: string) {
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }

    const {
      phone,
      email,
      fullName,
      gender,
      address,
      wardCode,
      birthDay,
      isManage,
      isActive,
      note,
    } = dto;

    const staff = await this.getStaffByCode(code);
    if (phone) {
      if (!phone.match(PHONE_REGEX)) {
        throw new BadRequestException('INVALID_PHONE_NUMBER');
      }
      const staffExistPhone = await this.findOneStaffByPhone(phone);
      if (staffExistPhone) {
        throw new BadRequestException('PHONE_ALREADY_EXIST');
      }
      staff.phone = phone;
    }

    if (email) {
      if (!email.match(EMAIL_REGEX)) {
        throw new BadRequestException('INVALID_EMAIL');
      }
      const staffExistEmail = await this.findOneStaffByEmail(email);
      if (staffExistEmail) {
        throw new BadRequestException('EMAIL_ALREADY_EXIST');
      }
      staff.email = email;
    }

    if (fullName) {
      let newFullName = fullName.trim();
      if (!newFullName) {
        throw new BadRequestException('FULL_NAME_IS_REQUIRED');
      }
      staff.fullName = newFullName;
    }

    switch (gender) {
      case GenderEnum.FEMALE:
      case GenderEnum.MALE:
      case GenderEnum.OTHER:
        staff.gender = gender;
        break;
      default:
        break;
    }

    switch (isActive) {
      case ActiveStatusEnum.ACTIVE:
        staff.isActive = true;
        break;
      case ActiveStatusEnum.INACTIVE:
        if (userId === staff.id) {
          throw new BadRequestException('NOT_INACTIVE_YOUR_SELF');
        }
        staff.isActive = false;
        break;
      default:
        break;
    }

    if (address) {
      staff.address = address.trim();
    }

    if (wardCode) {
      const ward = await this.dataSource.getRepository(Ward).findOne({
        where: { code: wardCode ? wardCode : 0 },
        relations: { district: { province: true } },
      });
      staff.ward = ward;
      if (ward) {
        staff.fullAddress = `${staff.address}, ${ward.name}, ${ward.district.name}, ${ward.district.province.name}`;
      }
    }

    if (birthDay) {
      const currentDate = moment().startOf('day').add(7, 'hour').toDate();
      const newBirthDay = moment(birthDay)
        .startOf('day')
        .add(7, 'hour')
        .toDate();
      if (newBirthDay >= currentDate) {
        throw new BadRequestException('BIRTHDAY_NOT_MORE_THAN_CURRENT_DATE');
      }
      staff.birthDay = newBirthDay;
    }

    switch (isManage) {
      case AdminRolesStringEnum.STAFF:
        if (userId === staff.id) {
          throw new BadRequestException('NOT_CHANGE_ROLE_YOUR_SELF');
        }
        staff.isManage = false;
        break;
      case AdminRolesStringEnum.MANAGER:
        staff.isManage = true;
        break;
    }

    if (note) {
      staff.note = note.trim();
    }
    staff.updatedBy = userId;

    const saveStaff = await this.staffRepository.save(staff);
    delete saveStaff.password;
    delete saveStaff.refreshToken;
    delete saveStaff.accessToken;
    delete saveStaff.otpCode;
    delete saveStaff.otpExpired;
    delete saveStaff.noteStatus;
    delete saveStaff.deletedAt;
    return saveStaff;
  }

  async deleteStaffByCode(code: string, userId: string) {
    const admin = await this.getStaffById(userId);
    if (!admin.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!admin.isManage) {
      throw new BadRequestException('USER_NOT_MANAGER');
    }
    const staff = await this.getStaffByCode(code);
    if (userId === staff.id) {
      throw new BadRequestException('NOT_DELETE_YOUR_SELF');
    }
    staff.deletedAt = new Date();
    staff.updatedBy = admin.id;
    const saveStaff = await this.staffRepository.save(staff);
    return {
      id: saveStaff.id,
      code: saveStaff.code,
      message: 'Xoá thành công',
    };
  }
}
