import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { GetPagination, Pagination } from 'src/decorator';
import { Province } from 'src/database/entities';

@Controller('province')
@ApiTags('Province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@GetPagination() pagination?: Pagination) {
    return this.provinceService.findAll(pagination);
  }

  // @Get('/crawl')
  // @HttpCode(HttpStatus.OK)
  // async crawlData() {
  //   const url = 'https://provinces.open-api.vn/api/p/';
  //   const data = await axios.get(url);
  //   data.data.forEach(async (element) => {
  //     const province = new Province();
  //     province.name = element.name;
  //     province.code = element.code;
  //     province.type = element.division_type;
  //     province.nameWithType = element.codename;
  //     this.provinceService.create(province);
  //   });

  //   return { demo: 'hello' };
  // }
}
