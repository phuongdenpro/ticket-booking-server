import { Ticket } from './ticket.entities';
import { OrderRefund } from './order-refund.entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'order_refund_detail' })
export class OrderRefundDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: true,
    default: 0.0,
    unsigned: true,
  })
  quantity: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'total', type: 'double', nullable: true, default: 0.0 })
  total: number;

  @OneToMany(() => OrderRefund, (orderRefund) => orderRefund.orderRefundDetails)
  @JoinColumn({ name: 'order_refund_id', referencedColumnName: 'id' })
  orderRefund: OrderRefund;

  @OneToMany(() => Ticket, (ticket) => ticket.orderRefundDetail)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.orderRefundDetail)
  @JoinColumn({ name: 'order_detail_id', referencedColumnName: 'id' })
  orderDetail: OrderDetail;

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
