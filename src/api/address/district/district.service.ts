import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province, Staff } from 'src/database/entities';
import { Pagination } from 'src/decorator';
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
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.id = :id', { id });

    const dataResult = await query.getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.districtRepository.createQueryBuilder('d');
    query.where('d.code = :code', { code });

    const dataResult = await query.getOne();
    return { dataResult };
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

  async save(dto: SaveDistrictDto, userId: string) {
    const province = await this.dataSource.getRepository(Province).findOne({
      where: { code: dto.provinceCode },
    });
    if (!province) {
      throw new BadRequestException('Province not found');
    }

    const district = new District();
    district.name = dto.name;
    district.type = dto.type;
    district.code = dto.code;
    district.codename = dto.nameWithType;
    district.provinceCode = province.code;
    district.parentCode = province.id;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    district.createdBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // update a record by id
  async updateById(id: string, dto: UpdateDistrictDto, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.id = :id', { id }).getOne();
    if (!district) {
      throw new BadRequestException('District not found');
    }
    if (district.name) {
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
    if (dto.provinceCode) {
      const province = await this.dataSource.getRepository(Province).findOne({
        where: { code: dto.provinceCode },
      });
      if (!province) {
        throw new BadRequestException('Province not found');
      }
      district.provinceCode = province.code;
      district.parentCode = province.id;
    }

    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    district.updatedBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // update a record by code
  async updateByCode(code: number, dto: UpdateDistrictDto, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.code = :code', { code }).getOne();
    if (!district) {
      throw new BadRequestException('District not found');
    }
    if (district.name) {
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
    if (dto.provinceCode) {
      const province = await this.dataSource.getRepository(Province).findOne({
        where: { code: dto.provinceCode },
      });
      if (!province) {
        throw new BadRequestException('Province not found');
      }
      district.provinceCode = province.code;
      district.parentCode = province.id;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException();
    }
    district.updatedBy = adminExist.id;

    return await this.districtRepository.save(district);
  }

  // delete a record by id
  async deleteById(id: string, userId: string) {
    const query = this.districtRepository.createQueryBuilder('d');
    const district = await query.where('d.id = :id', { id }).getOne();
    if (!district) {
      throw new BadRequestException('province not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException();
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
      throw new BadRequestException('province not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException();
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
