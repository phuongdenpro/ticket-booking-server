import { AdminService } from './../../admin/admin.service';
import { SortEnum } from './../../../enums';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Ward, District } from './../../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from './../../../decorator';
import {
  SaveWardDto,
  FilterWardDto,
  UpdateWardDto,
  WardDeleteMultiId,
  WardDeleteMultiCode,
} from './dto';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
    private readonly adminService: AdminService,
    private dataSource: DataSource,
  ) {}

  async findOneWard(options: any) {
    return await this.wardRepository.findOne({
      where: { ...options?.where },
      select: {
        deletedAt: false,
        ...options?.select,
      },
      relations: {
        ...options?.relations,
      },
      order: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
      },
      ...options?.other,
    });
  }

  async findOneById(id: number, options?: any) {
    if (options) {
      options.where = { id, ...options?.where };
    } else {
      options = { where: { id } };
    }
    return await this.findOneWard(options);
  }

  async findOneByCode(code: number, options?: any) {
    if (options) {
      options.where = { code, ...options?.where };
    } else {
      options = { where: { code } };
    }
    return await this.findOneWard(options);
  }

  async findByDistrictCode(districtCode: number, pagination?: Pagination) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.districtCode = :districtCode', { districtCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .orderBy('w.code', SortEnum.DESC)
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async getWardById(id: number) {
    const ward = await this.findOneById(id);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    return ward;
  }

  async getWardByCode(code: number) {
    const ward = await this.findOneByCode(code);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    return ward;
  }

  async findAll(dto: FilterWardDto, pagination?: Pagination) {
    const { name, type, codename, districtCode } = dto;

    const query = this.wardRepository.createQueryBuilder('w');

    if (name) {
      query.andWhere('w.name ILIKE :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('w.type ILIKE :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('w.codename ILIKE :codename', {
        codename: `%${codename}%`,
      });
    }
    if (districtCode) {
      query.andWhere('w.districtCode = :districtCode', { districtCode });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .orderBy('w.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async createWard(dto: SaveWardDto, userId: string) {
    const { code, codename, type, districtCode, name } = dto;
    const district = await this.dataSource.getRepository(District).findOne({
      where: { code: districtCode },
    });
    if (!district) {
      throw new BadRequestException('DISTRICT_NOT_FOUND');
    }
    const wardExists = await this.findOneByCode(code, {
      withDeleted: true,
    });
    if (!wardExists) {
      throw new BadRequestException('WARD_CODE_ALREADY_EXIST');
    }

    const ward = new Ward();
    ward.name = name;
    ward.type = type;
    ward.code = code;
    ward.codename = codename;
    ward.district = district;
    ward.districtCode = district.code;

    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    ward.createdBy = adminExist.id;

    return await this.wardRepository.save(ward);
  }

  // update a record by id
  async updateById(id: number, dto: UpdateWardDto, userId: string) {
    const { type, name, codename, districtCode } = dto;
    const ward = await this.findOneById(id);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    if (name) {
      ward.name = name;
    }
    if (type) {
      ward.type = type;
    }
    if (codename) {
      ward.codename = codename;
    }
    if (districtCode) {
      const dist = await this.dataSource
        .getRepository(District)
        .findOne({ where: { code: districtCode } });
      if (!dist) {
        throw new BadRequestException('DISTRICT_NOT_FOUND');
      }
      ward.districtCode = dist.code;
      ward.district = dist;
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    ward.updatedBy = adminExist.id;

    return await this.wardRepository.save(ward);
  }

  // update a record by code
  async updateByCode(code: number, dto: UpdateWardDto, userId: string) {
    const { type, name, codename, districtCode } = dto;
    const ward = await this.findOneByCode(code);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }

    if (name) {
      ward.name = name;
    }
    if (type) {
      ward.type = type;
    }
    if (codename) {
      ward.codename = codename;
    }
    if (districtCode) {
      const dist = await this.dataSource
        .getRepository(District)
        .findOne({ where: { code: districtCode } });
      if (!dist) {
        throw new BadRequestException('DISTRICT_NOT_FOUND');
      }
      ward.districtCode = dist.code;
      ward.district = dist;
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    ward.updatedBy = adminExist.id;

    return await this.wardRepository.save(ward);
  }

  // delete a record by id
  async deleteById(id: number, userId: string) {
    const ward = await this.findOneById(id);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    ward.updatedBy = adminExist.id;
    ward.deletedAt = new Date();

    return await this.wardRepository.save(ward);
  }

  // delete a record by code
  async deleteByCode(code: number, userId: string) {
    const ward = await this.findOneByCode(code);
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneById(userId);
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (adminExist && !adminExist.isActive) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    ward.updatedBy = adminExist.id;
    ward.deletedAt = new Date();

    return await this.wardRepository.save(ward);
  }

  async deleteMultipleWardById(userId: string, dto: WardDeleteMultiId) {
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

  async deleteMultipleWardByCode(userId: string, dto: WardDeleteMultiCode) {
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
