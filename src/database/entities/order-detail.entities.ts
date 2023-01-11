import { PriceDetail } from './price-detail.entities';
import { Order } from './order.entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Ticket } from './ticket.entities';
import { OrderRefundDetail } from './order-refund-detail.entities';
import { PromotionHistory } from './promotion-history.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'order_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: true,
    default: 1,
    unsigned: true,
  })
  quantity: number;

  @Column({ name: 'total', type: 'double', nullable: true, default: 0.0 })
  total: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => PriceDetail, (priceDetail) => priceDetail.orderDetails)
  @JoinColumn({ name: 'price_id', referencedColumnName: 'id' })
  priceDetail: PriceDetail;

  @OneToOne(() => Ticket, (ticket) => ticket.orderDetail)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.orderRefundDetail)
  orderRefundDetail: OrderRefundDetail;

  @OneToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.buyOrderDetail,
  )
  buyPromotionHistory: PromotionHistory;

  @OneToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.receiveOrderDetail,
  )
  receivePromotionHistory: PromotionHistory;

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
