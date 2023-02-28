import { TicketGroup } from './../../database/entities/ticket-group.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TicketGroupService } from './ticket-group.service';
import { TicketGroupController } from './ticket-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketGroup])],
  providers: [TicketGroupService],
  controllers: [TicketGroupController],
  exports: [TicketGroupService],
})
export class TicketGroupModule {}
