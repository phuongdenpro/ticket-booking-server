import { SaveProvinceDto } from './dto/save-province.dto';
import { Province, Staff } from 'src/database/entities';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/decorator';
import { DataSource, Repository } from 'typeorm';
import {
  FilterProvinceDto,
  ProvinceDeleteMultiCode,
  ProvinceDeleteMultiId,
} from './dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    private dataSource: DataSource,
  ) {}

  async findOneById(id: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.id = :id', { id });

    const dataResult = await query.getOne();
    return { dataResult };
  }

  async findOneByCode(code: number) {
    const query = this.provinceRepository.createQueryBuilder('p');
    query.where('p.code = :code', { code });

    const dataResult = await query.getOne();
    return { dataResult };
  }

  // find all
  async findAll(dto: FilterProvinceDto, pagination?: Pagination) {
    const { name, type, codename } = dto;

    const query = this.provinceRepository.createQueryBuilder('p');

    if (name) {
      query.andWhere('p.name like :name', { name: `%${name}%` });
    }
    if (type) {
      query.andWhere('p.type like :type', { type: `%${type}%` });
    }
    if (codename) {
      query.andWhere('p.codename like :codename', {
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
  async save(dto: SaveProvinceDto, userId: string) {
    const province = new Province();
    province.name = dto.name;
    province.type = dto.type;
    province.code = dto.code;
    province.codename = dto.codename;
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    province.createdBy = adminExist.id;
    return await this.provinceRepository.save(province);
  }

  // update a record by id
  async updateById(id: string, dto: SaveProvinceDto, userId: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.id = :id', { id }).getOne();
    if (!province) return null;
    if (dto.name) {
      province.name = dto.name;
    }
    if (dto.type) {
      province.type = dto.type;
    }
    if (dto.code) {
      province.code = dto.code;
    }
    if (dto.codename) {
      province.codename = dto.codename;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    province.updatedBy = adminExist.id;

    return await this.provinceRepository.save(province);
  }

  // update a record by code
  async updateByCode(code: number, dto: SaveProvinceDto, userId: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.code = :code', { code }).getOne();
    if (!province) {
      throw new BadRequestException('Province not found');
    }
    if (dto.name) {
      province.name = dto.name;
    }
    if (dto.type) {
      province.type = dto.type;
    }
    if (dto.code) {
      province.code = code;
    }
    if (dto.codename) {
      province.codename = dto.codename;
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    province.updatedBy = adminExist.id;

    return await this.provinceRepository.save(province);
  }

  // delete a record by id
  async deleteById(id: string, userId: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.id = :id', { id }).getOne();
    if (!province) {
      throw new BadRequestException('Province not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    province.updatedBy = adminExist.id;
    province.deletedAt = new Date();
    return await this.provinceRepository.save(province);
  }

  // delete a record by code
  async deleteByCode(code: number, userId: string) {
    const query = this.provinceRepository.createQueryBuilder('p');
    const province = await query.where('p.code = :code', { code }).getOne();
    if (!province) {
      throw new BadRequestException('Province not found');
    }
    const adminExist = await this.dataSource
      .getRepository(Staff)
      .findOne({ where: { id: userId, isActive: true } });
    if (!adminExist) {
      throw new UnauthorizedException('UNAUTHORIZED');
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
