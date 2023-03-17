import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Ticket, TicketGroup } from '.';

@Entity({ name: 'ticket_group-detail' })
export class TicketGroupDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  public updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;

  // relationship
  @ManyToOne(() => TicketGroup, (ticketGroup) => ticketGroup.ticketGroupDetail)
  @JoinColumn([{ name: 'ticket_group_id', referencedColumnName: 'id' }])
  ticketGroup: TicketGroup;

  @ManyToOne(() => Ticket, (ticket) => ticket.ticketGroupDetails)
  @JoinColumn([{ name: 'ticket_id', referencedColumnName: 'id' }])
  ticket: Ticket;
}
