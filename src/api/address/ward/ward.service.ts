import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Ward, District, Staff } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from 'src/decorator';
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
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.id = :id', { id });

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.code = :code', { code });

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();
    return { dataResult };
  }

  async findByDistrictCode(districtCode: number, pagination?: Pagination) {
    const query = this.wardRepository.createQueryBuilder('w');
    query.where('w.districtCode = :districtCode', { districtCode });
    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('w.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  // find all
  async findAll(dto: FilterWardDto, pagination?: Pagination) {
    const { name, type, codename: nameWithType, districtCode } = dto;

    const query = this.wardRepository.createQueryBuilder('w');

    if (name) {
      query.andWhere('w.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('w.type like :type', { type: `%${type}%` });
    }
    if (nameWithType) {
      query.andWhere('w.name_with_type like :name_with_type', {
        name_with_type: `%${nameWithType}%`,
      });
    }
    if (districtCode) {
      query.andWhere('w.districtCode = :districtCode', { districtCode });
    }

    const total = await query.clone().getCount();

    const dataResult = await query
      .andWhere('w.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('w.code', 'ASC')
      .offset(pagination.skip)
      .limit(pagination.take)
      .getMany();
    return { dataResult, pagination, total };
  }

  async save(dto: SaveWardDto, userId: string) {
    const district = await this.dataSource.getRepository(District).findOne({
      where: { code: dto.districtCode },
    });
    if (!district) {
      throw new BadRequestException('district code is not exist');
    }

    const ward = new Ward();
    ward.name = dto.name;
    ward.type = dto.type;
    ward.code = dto.code;
    ward.codename = dto.codename;
    ward.districtCode = dto.districtCode;
    ward.parentCode = district.id;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('admin is not authorized');
    }
    ward.createdBy = adminExist.id;

    return await this.wardRepository.save(ward);
  }

  // update a record by id
  async updateById(id: number, dto: UpdateWardDto, userId: string) {
    const district = await this.wardRepository.findOne({ where: { id } });

    if (!district) {
      throw new BadRequestException('ward not found');
    }
    if (dto.name) {
      district.name = dto.name;
    }
    if (dto.type) {
      district.type = dto.type;
    }
    if (dto.code) {
      district.code = dto.code;
    }
    if (dto.codename) {
      district.codename = dto.codename;
    }
    if (dto.districtCode) {
      district.districtCode = dto.districtCode;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('admin is not authorized');
    }
    district.updatedBy = adminExist.id;

    return await this.wardRepository.save(district);
  }

  // update a record by code
  async updateByCode(code: number, dto: UpdateWardDto, userId: string) {
    const query = this.wardRepository.createQueryBuilder('w');
    const district = await query.where('w.code = :code', { code }).getOne();
    if (!district) {
      throw new BadRequestException('ward not found');
    }

    if (dto.name) {
      district.name = dto.name;
    }
    if (dto.type) {
      district.type = dto.type;
    }
    if (dto.code) {
      district.code = code;
    }
    if (dto.codename) {
      district.codename = dto.codename;
    }
    if (dto.districtCode) {
      district.districtCode = dto.districtCode;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('admin is not authorized');
    }
    district.updatedBy = adminExist.id;

    return await this.wardRepository.save(district);
  }

  // delete a record by id
  async deleteById(id: number, userId: string) {
    const province = await this.wardRepository.findOne({ where: { id } });
    if (!province) {
      throw new BadRequestException('ward not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('admin is not authorized');
    }
    province.updatedBy = adminExist.id;
    province.deletedAt = new Date();

    return await this.wardRepository.save(province);
  }

  // delete a record by code
  async deleteByCode(code: number, userId: string) {
    const query = this.wardRepository.createQueryBuilder('w');
    const province = await query.where('w.code = :code', { code }).getOne();
    if (!province) {
      throw new BadRequestException('ward not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('admin is not authorized');
    }
    province.updatedBy = adminExist.id;
    province.deletedAt = new Date();

    return await this.wardRepository.save(province);
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
