import { AdminService } from './../../admin/admin.service';
import { DeleteDtoTypeEnum, SortEnum } from './../../../enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province, Staff } from './../../../database/entities';
import { Pagination } from './../../../decorator';
import { DataSource, Repository } from 'typeorm';
import {
  UpdateDistrictDto,
  FilterDistrictDto,
  SaveDistrictDto,
  DistrictDeleteMultiByIdsOrCodes,
} from './dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    private readonly adminService: AdminService,
    private dataSource: DataSource,
  ) {}

  async findOneDistrict(options: any) {
    return await this.districtRepository.findOne({
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

  async findOneById(id: string, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneDistrict(options);
  }

  async findOneByCode(code: number, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneDistrict(options);
  }

  async findByProvinceCode(provinceCode: number, pagination?: Pagination) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.provinceCode = :provinceCode', { provinceCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .orderBy('d.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterDistrictDto, pagination?: Pagination) {
    const { name, type, codename, provinceCode } = dto;

    const query = this.districtRepository.createQueryBuilder('d');

    if (name) {
      query.andWhere('d.name LIKE :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('d.type LIKE :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('d.codename LIKE :codename', {
        codename: `%${codename}%`,
      });
    }
    if (provinceCode) {
      query.andWhere('d.provinceCode = :provinceCode', { provinceCode });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .orderBy('d.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async createDistrict(dto: SaveDistrictDto, userId: string) {
    const { code, codename, name, provinceCode, type } = dto;
    const province = await this.dataSource.getRepository(Province).findOne({
      where: { code: provinceCode },
    });
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const districtExist = await this.findOneByCode(code, {
      withDeleted: true,
    });
    if (districtExist) {
      throw new BadRequestException('DISTRICT_CODE_EXISTED');
    }

    const district = new District();
    district.name = name;
    district.type = type;
    district.code = code;
    district.codename = codename;
    district.provinceCode = province.code;
    district.province = province;
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    district.createdBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // update a record by id
  async updateByIdOrCode(
    dto: UpdateDistrictDto,
    userId: string,
    id?: string,
    code?: number,
  ) {
    const { codename, name, provinceCode, type } = dto;
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    let district;
    if (id) {
      district = await this.findOneById(id);
    } else {
      district = await this.findOneByCode(code);
    }
    if (!district) {
      throw new BadRequestException('DISTRICT_NOT_FOUND');
    }
    if (district.name) {
      district.name = name;
    }
    if (type) {
      district.type = type;
    }
    if (codename) {
      district.codename = codename;
    }
    if (provinceCode) {
      const province = await this.dataSource.getRepository(Province).findOne({
        where: { code: provinceCode },
      });
      if (!province) {
        throw new BadRequestException('PROVINCE_NOT_FOUND');
      }
      district.provinceCode = province.code;
      district.province = province;
    }

    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    district.updatedBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // delete a record by id
  async deleteByIdOrCode(userId: string, id?: string, code?: number) {
    if (!id && !code) {
      throw new BadRequestException('ID_OR_CODE_REQUIRED');
    }
    let district;
    if (id) {
      district = await this.findOneById(id);
    } else {
      district = await this.findOneByCode(code);
    }
    if (!district) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }

    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }

    district.updatedBy = adminExist.id;
    district.deletedAt = new Date();
    return await this.districtRepository.save(district);
  }

  async deleteMultipleDistrictByIdsOrCodes(
    userId: string,
    dto: DistrictDeleteMultiByIdsOrCodes,
    type: DeleteDtoTypeEnum,
  ) {
    try {
      const { list } = dto;
      const adminExist = await this.dataSource
        .getRepository(Staff)
        .findOne({ where: { id: userId } });
      if (!adminExist) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
      if (!adminExist.isActive) {
        throw new BadRequestException('USER_NOT_ACTIVE');
      }
      const newList = await Promise.all(
        list.map(async (data) => {
          if (!data) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: `${type} không được để trống`,
            };
          }
          let district: District;
          if (type === DeleteDtoTypeEnum.ID) {
            district = await this.findOneById(data);
          } else {
            const code = parseInt(data);
            district = await this.findOneByCode(code);
          }
          if (!district) {
            return {
              id: type === DeleteDtoTypeEnum.ID ? data : undefined,
              code: type === DeleteDtoTypeEnum.CODE ? data : undefined,
              message: 'Không tìm thấy quận/huyện',
            };
          }
          district.updatedBy = adminExist.id;
          district.deletedAt = new Date();
          await this.districtRepository.save(district);
          return {
            id: district.id,
            code: district.code,
            message: 'Xoá thành công',
          };
        }),
      );
      return newList;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
