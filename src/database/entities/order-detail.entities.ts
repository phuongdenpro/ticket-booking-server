import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Order, PriceDetail, TicketDetail, OrderRefundDetail } from '.';

@Entity({ name: 'order_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'total',
    type: 'double',
    nullable: true,
    default: 0.0,
    unsigned: true,
  })
  total: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({
    name: 'order_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  orderCode: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
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

  // relationships
  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => PriceDetail, (priceDetail) => priceDetail.orderDetails)
  @JoinColumn({ name: 'price_detail_id', referencedColumnName: 'id' })
  priceDetail: PriceDetail;

  @ManyToOne(() => TicketDetail, (ticketDetail) => ticketDetail.orderDetails)
  @JoinColumn({ name: 'ticket_detail_id', referencedColumnName: 'id' })
  ticketDetail: TicketDetail;

  @OneToOne(
    () => OrderRefundDetail,
    (orderDetailRefund) => orderDetailRefund.orderDetail,
  )
  orderRefundDetail: OrderRefundDetail;
}
