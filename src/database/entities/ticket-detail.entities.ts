import { Seat } from './seat.entities';
import { Ticket } from './ticket.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'ticket_detail' })
export class TicketDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'create_date', type: 'timestamp', nullable: true })
  createDate: Date;

  @OneToOne(() => Ticket, (ticket) => ticket.ticketDetail)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @ManyToOne(() => Seat, (seat) => seat.ticketDetails)
  @JoinColumn({ name: 'seat_id', referencedColumnName: 'id' })
  seat: Seat;

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
