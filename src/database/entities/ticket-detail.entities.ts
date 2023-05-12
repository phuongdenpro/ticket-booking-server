import { TicketStatusEnum } from './../../enums';
import { Seat, Ticket, OrderDetail, OrderRefundDetail } from '.';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'ticket_detail' })
export class TicketDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: TicketStatusEnum.NON_SOLD,
  })
  status: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
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

  // relationships
  @ManyToOne(() => Ticket, (ticket) => ticket.ticketDetails)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @ManyToOne(() => Seat, (seat) => seat.ticketDetails)
  @JoinColumn({ name: 'seat_id', referencedColumnName: 'id' })
  seat: Seat;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.ticketDetail)
  orderDetails: OrderDetail[];

  @OneToMany(
    () => OrderRefundDetail,
    (orderDetailRefund) => orderDetailRefund.ticketDetail,
  )
  orderRefundDetails: OrderRefundDetail[];
}
