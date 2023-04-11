import { OrderDetail, TicketDetail, OrderRefund } from '.';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'order_refund_detail' })
export class OrderRefundDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total', type: 'double', nullable: true, default: 0.0 })
  total: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({
    name: 'order_refund_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  orderRefundCode: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
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

  // relationships
  @OneToMany(() => OrderRefund, (orderRefund) => orderRefund.orderRefundDetails)
  @JoinColumn({ name: 'order_refund_id', referencedColumnName: 'id' })
  orderRefund: OrderRefund;

  @OneToOne(() => TicketDetail, (ticketDetail) => ticketDetail.orderDetail)
  @JoinColumn({ name: 'ticket_detail_id', referencedColumnName: 'id' })
  ticketDetail: TicketDetail;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.orderRefundDetail)
  @JoinColumn({ name: 'order_detail_id', referencedColumnName: 'id' })
  orderDetail: OrderDetail;
}
