import { PriceDetail, PriceList, TicketGroup } from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceListController } from './price-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriceList, TicketGroup, PriceDetail])],
  providers: [PriceListService],
  controllers: [PriceListController],
  exports: [PriceListService],
})
export class PriceListModule {}
