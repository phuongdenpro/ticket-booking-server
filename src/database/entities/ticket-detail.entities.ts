import { Seat } from './seat.entities';
import { Ticket } from './ticket.entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'ticket_detail' })
export class TicketDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'create_date', type: 'timestamp', nullable: false })
  createDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
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

  // relationships
  @OneToOne(() => Ticket, (ticket) => ticket.ticketDetail)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @ManyToOne(() => Seat, (seat) => seat.ticketDetails)
  @JoinColumn({ name: 'seat_id', referencedColumnName: 'id' })
  seat: Seat;

  // @ManyToOne(() => TicketDetail, (ticketDetail) => ticketDetail.ticket)
  // @JoinColumn({ name: 'trip_detail_id', referencedColumnName: 'id' })
  // tripDetail: TicketDetail;
}
