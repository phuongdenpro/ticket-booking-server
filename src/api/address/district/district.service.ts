import { AdminService } from './../../admin/admin.service';
import { SortEnum } from './../../../enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province } from './../../../database/entities';
import { Pagination } from './../../../decorator';
import { DataSource, Repository } from 'typeorm';
import {
  UpdateDistrictDto,
  FilterDistrictDto,
  SaveDistrictDto,
  DistrictDeleteMultiId,
  DistrictDeleteMultiCode,
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
      relations: [].concat(options?.relations || []),
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
      query.andWhere('d.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('d.type like :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('d.codename like :codename', {
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
    const province = await this.dataSource.getRepository(Province).findOne({
      where: { code: dto.provinceCode },
    });
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const districtExist = await this.findOneByCode(dto.code);
    if (districtExist) {
      throw new BadRequestException('DISTRICT_CODE_EXISTED');
    }

    const district = new District();
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.codename = dto.codename;
    district.provinceCode = province.code;
    district.province = province;
    const adminExist = await this.adminService.findOneBydId(userId);
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
  async updateById(id: string, dto: UpdateDistrictDto, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.id = :id', { id }).getOne();
    if (!district) {
      throw new BadRequestException('DISTRICT_NOT_FOUND');
    }
    if (district.name) {
      district.name = dto.name;
    }
    if (dto.type) {
      district.type = dto.type;
    }
    if (dto.codename) {
      district.codename = dto.codename;
    }
    if (dto.provinceCode) {
      const province = await this.dataSource.getRepository(Province).findOne({
        where: { code: dto.provinceCode },
      });
      if (!province) {
        throw new BadRequestException('PROVINCE_NOT_FOUND');
      }
      district.provinceCode = province.code;
      district.province = province;
    }

    const adminExist = await this.adminService.findOneBydId(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    district.updatedBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // update a record by code
  async updateByCode(code: number, dto: UpdateDistrictDto, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.code = :code', { code }).getOne();
    if (!district) {
      throw new BadRequestException('DISTRICT_NOT_FOUND');
    }
    if (district.name) {
      district.name = dto.name;
    }
    if (dto.type) {
      district.type = dto.type;
    }
    if (dto.codename) {
      district.codename = dto.codename;
    }
    if (dto.provinceCode) {
      const province = await this.dataSource.getRepository(Province).findOne({
        where: { code: dto.provinceCode },
      });
      if (!province) {
        throw new BadRequestException('PROVINCE_NOT_FOUND');
      }
      district.provinceCode = province.code;
      district.province = province;
    }
    const adminExist = await this.adminService.findOneBydId(userId);
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
  async deleteById(id: string, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.id = :id', { id }).getOne();
    if (!district) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneBydId(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    district.updatedBy = adminExist.id;
    district.deletedAt = new Date();

    return await this.districtRepository.save(district);
  }

  // delete a record by code
  async deleteByCode(code: number, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.code = :code', { code }).getOne();
    if (!district) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneBydId(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    district.updatedBy = adminExist.id;
    district.deletedAt = new Date();

    return await this.districtRepository.save(district);
  }

  async deleteMultipleDistrictById(userId: string, dto: DistrictDeleteMultiId) {
    try {
      const { ids } = dto;

      const list = await Promise.all(
        ids.map(async (id) => await this.deleteById(id, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteMultipleDistrictByCode(
    userId: string,
    dto: DistrictDeleteMultiCode,
  ) {
    try {
      const { codes } = dto;

      const list = await Promise.all(
        codes.map(async (code) => await this.deleteByCode(code, userId)),
      );
      return list;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
