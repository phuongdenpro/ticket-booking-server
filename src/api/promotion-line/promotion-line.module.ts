import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PromotionLineService } from './promotion-line.service';
import { PromotionLineController } from './promotion-line.controller';
import {
  ApplicableTicketGroup,
  Promotion,
  PromotionDetail,
  PromotionLine,
  TicketGroup,
} from './../../database/entities';
import { ApplicableTicketGroupService } from '../applicable-ticket-group/applicable-ticket-group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionLine,
      Promotion,
      PromotionDetail,
      ApplicableTicketGroup,
      TicketGroup,
    ]),
  ],
  providers: [PromotionLineService, ApplicableTicketGroupService],
  controllers: [PromotionLineController],
  exports: [PromotionLineService],
})
export class PromotionLineModule {}
