import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import {
  ApplicableTicketGroup,
  PromotionDetail,
  TicketGroup,
} from './../../database/entities';
import { ApplicableTicketGroupService } from './applicable-ticket-group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicableTicketGroup,
      PromotionDetail,
      TicketGroup,
    ]),
  ],
  providers: [ApplicableTicketGroupService],
  exports: [ApplicableTicketGroupService],
})
export class ApplicableTicketGroupModule {}
