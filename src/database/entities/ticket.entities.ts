import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TicketDetail,
  OrderDetail,
  TicketGroupDetail,
  OrderRefundDetail,
  TripDetail,
} from '.';

@Entity({ name: 'ticket' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'image', type: 'text' })
  image: string;

  @Column({ name: 'status', type: 'tinyint', default: 0 })
  status: boolean;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

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

  // relationship
  // @OneToMany(
  //   () => ApplicableTicket,
  //   (applicableTicket) => applicableTicket.ticket,
  // )
  // applicableTicket: ApplicableTicket[];

  @OneToMany(
    () => TicketGroupDetail,
    (ticketGroupDetail) => ticketGroupDetail.ticket,
  )
  ticketGroupDetail: TicketGroupDetail[];

  @OneToOne(() => TicketDetail, (ticketDetail) => ticketDetail.ticket)
  ticketDetail: TicketDetail;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.ticket)
  orderDetail: OrderDetail;

  @ManyToOne(
    () => OrderRefundDetail,
    (orderRefundDetail) => orderRefundDetail.ticket,
  )
  @JoinColumn({ name: 'order_refund_detail_id', referencedColumnName: 'id' })
  orderRefundDetail: OrderRefundDetail;

  @ManyToOne(() => TripDetail, (tripDetail) => tripDetail.tickets)
  @JoinColumn({ name: 'trip_detail_id', referencedColumnName: 'id' })
  tripDetail: TripDetail;
}
