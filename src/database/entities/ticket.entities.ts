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
  TicketGroupDetail,
  OrderRefundDetail,
  TripDetail,
} from '.';

@Entity({ name: 'ticket' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: boolean;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

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
  @OneToMany(
    () => TicketGroupDetail,
    (ticketGroupDetail) => ticketGroupDetail.ticket,
  )
  ticketGroupDetails: TicketGroupDetail[];

  @OneToMany(() => TicketDetail, (ticketDetail) => ticketDetail.ticket)
  ticketDetails: TicketDetail[];

  @ManyToOne(
    () => OrderRefundDetail,
    (orderRefundDetail) => orderRefundDetail.ticket,
  )
  @JoinColumn({ name: 'order_refund_detail_id', referencedColumnName: 'id' })
  orderRefundDetail: OrderRefundDetail;

  @OneToOne(() => TripDetail, (tripDetail) => tripDetail.tickets)
  @JoinColumn({ name: 'trip_detail_id', referencedColumnName: 'id' })
  tripDetail: TripDetail;
}
