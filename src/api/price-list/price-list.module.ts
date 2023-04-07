import { PriceDetail, PriceList } from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceListController } from './price-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriceList, PriceDetail])],
  controllers: [PriceListController],
  providers: [PriceListService],
  exports: [PriceListService],
})
export class PriceListModule {}
