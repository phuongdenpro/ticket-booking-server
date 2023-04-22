import { AdminService } from './../../admin/admin.service';
import { SortEnum } from './../../../enums';
import { Province } from './../../../database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from './../../../decorator';
import { Repository } from 'typeorm';
import {
  FilterProvinceDto,
  ProvinceDeleteMultiCode,
  ProvinceDeleteMultiId,
  SaveProvinceDto,
  UpdateProvinceDto,
} from './dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    private readonly adminService: AdminService,
  ) {}

  async findOneProvince(options: any) {
    return await this.provinceRepository.findOne({
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
    return await this.findOneProvince(options);
  }

  async findOneByCode(code: number, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneProvince(options);
  }

  // find all
  async findAll(dto: FilterProvinceDto, pagination?: Pagination) {
    const { name, type, codename } = dto;

    const query = this.provinceRepository.createQueryBuilder('p');

    if (name) {
      query.andWhere('p.name LIKE :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('p.type LIKE :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('p.codename LIKE :codename', {
        codename: `%${codename}%`,
      });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .orderBy('p.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // insert a new record
  async createProvince(dto: SaveProvinceDto, userId: string) {
    const { code, codename, name, type } = dto;
    const provinceExists = await this.findOneByCode(code, {
      withDeleted: true,
    });
    if (provinceExists) {
      throw new BadRequestException('PROVINCE_CODE_ALREADY_EXIST');
    }

    const province = new Province();
    province.name = name;
    province.type = type;
    province.code = code;
    province.codename = codename;
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    province.createdBy = adminExist.id;
    return await this.provinceRepository.save(province);
  }

  // update a record by id
  async updateById(id: string, dto: UpdateProvinceDto, userId: string) {
    const { name, type, codename } = dto;
    const province = await this.findOneById(id);
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    if (name) {
      province.name = name;
    }
    if (type) {
      province.type = type;
    }
    if (codename) {
      province.codename = codename;
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    province.updatedBy = adminExist.id;

    return await this.provinceRepository.save(province);
  }

  // update a record by code
  async updateByCode(code: number, dto: UpdateProvinceDto, userId: string) {
    const { name, type, codename } = dto;
    const province = await this.findOneByCode(code);
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    if (name) {
      province.name = name;
    }
    if (type) {
      province.type = type;
    }
    if (codename) {
      province.codename = codename;
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    province.updatedBy = adminExist.id;

    return await this.provinceRepository.save(province);
  }

  // delete a record by id
  async deleteById(id: string, userId: string) {
    const province = await this.findOneById(id);
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    province.updatedBy = adminExist.id;
    province.deletedAt = new Date();
    return await this.provinceRepository.save(province);
  }

  // delete a record by code
  async deleteByCode(code: number, userId: string) {
    const province = await this.findOneByCode(code);
    if (!province) {
      throw new BadRequestException('PROVINCE_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!adminExist.isActive) {
      throw new UnauthorizedException('USER_NOT_ACTIVE');
    }
    province.updatedBy = adminExist.id;
    province.deletedAt = new Date();
    return await this.provinceRepository.save(province);
  }

  async deleteMultipleProvinceById(userId: string, dto: ProvinceDeleteMultiId) {
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

  async deleteMultipleProvinceByCode(
    userId: string,
    dto: ProvinceDeleteMultiCode,
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
