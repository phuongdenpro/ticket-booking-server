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
      order: {
        createdAt: SortEnum.DESC,
        ...options?.orderBy,
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

  // find all
  async findAll(dto: FilterWardDto, pagination?: Pagination) {
    const { name, type, codename, districtCode } = dto;

    const query = this.wardRepository.createQueryBuilder('w');

    if (name) {
      query.andWhere('w.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('w.type like :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('w.codename like :codename', {
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
    const district = await this.dataSource.getRepository(District).findOne({
      where: { code: dto.districtCode },
    });
    if (!district) {
      throw new BadRequestException('DISTRICT_NOT_FOUND');
    }

    const ward = new Ward();
    if (dto.name) {
      ward.name = dto.name;
    }
    if (dto.type) {
      ward.type = dto.type;
    }
    if (dto.code) {
      ward.code = dto.code;
    }
    if (dto.codename) {
      ward.codename = dto.codename;
    }
    ward.district = district;
    ward.districtCode = district.code;

    const adminExist = await this.adminService.findOneBydId(userId);
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
    const ward = await this.wardRepository.findOne({ where: { id } });

    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    if (dto.name) {
      ward.name = dto.name;
    }
    if (dto.type) {
      ward.type = dto.type;
    }
    if (dto.code) {
      ward.code = dto.code;
    }
    if (dto.codename) {
      ward.codename = dto.codename;
    }
    if (dto.districtCode) {
      const dist = await this.dataSource
        .getRepository(District)
        .findOne({ where: { code: dto.districtCode } });
      if (!dist) {
        throw new BadRequestException('district is not exist');
      }
      ward.districtCode = dist.code;
      ward.district = dist;
    }
    const adminExist = await this.adminService.findOneBydId(userId);
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
    const query = this.wardRepository.createQueryBuilder('w');
    const ward = await query.where('w.code = :code', { code }).getOne();
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }

    if (dto.name) {
      ward.name = dto.name;
    }
    if (dto.type) {
      ward.type = dto.type;
    }
    if (dto.code) {
      ward.code = code;
    }
    if (dto.codename) {
      ward.codename = dto.codename;
    }
    if (dto.districtCode) {
      const dist = await this.dataSource
        .getRepository(District)
        .findOne({ where: { code: dto.districtCode } });
      if (!dist) {
        throw new BadRequestException('district is not exist');
      }
      ward.districtCode = dist.code;
      ward.district = dist;
    }
    const adminExist = await this.adminService.findOneBydId(userId);
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
    const ward = await this.wardRepository.findOne({ where: { id } });
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneBydId(userId);
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
    const query = this.wardRepository.createQueryBuilder('w');
    const ward = await query.where('w.code = :code', { code }).getOne();
    if (!ward) {
      throw new BadRequestException('WARD_NOT_FOUND');
    }
    const adminExist = await this.adminService.findOneBydId(userId);
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
