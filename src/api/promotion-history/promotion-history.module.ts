import { Module } from '@nestjs/common';
import { PromotionHistoryService } from './promotion-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  PromotionHistory,
  PromotionLine,
} from './../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      PromotionLine,
      PromotionHistory,
    ]),
  ],
  providers: [PromotionHistoryService],
  exports: [PromotionHistoryService],
})
export class PromotionHistoryModule {}
