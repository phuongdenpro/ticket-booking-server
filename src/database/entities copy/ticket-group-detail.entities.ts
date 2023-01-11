import { CustomerGroup } from './customer-group.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Customer } from './customer.entities';
import { Promotion } from './promotion.entities';
import { PromotionDetail } from './promotion-detail.entities';
import { Ticket } from './ticket.entities';
import { TicketGroup } from './ticket-group.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'ticket_group-detail' })
export class TicketGroupDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TicketGroup, (ticketGroup) => ticketGroup.ticketGroupDetail)
  @JoinColumn([{ name: 'ticket_group_id', referencedColumnName: 'id' }])
  ticketGroup: TicketGroup;

  @ManyToOne(() => Ticket, (ticket) => ticket.ticketGroupDetail)
  @JoinColumn([{ name: 'ticket_id', referencedColumnName: 'id' }])
  ticket: Ticket;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;
}
