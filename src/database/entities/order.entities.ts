import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Customer } from './customer.entities';
import { OrderDetail } from './order-detail.entities';
import { OrderRefund } from './order-refund.entities';
import { PromotionHistory } from './promotion-history.entities';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'total', type: 'double', nullable: true, default: 0.0 })
  total: number;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ name: 'final_total', type: 'double', nullable: true, default: 0.0 })
  finalTotal: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @OneToOne(() => OrderRefund, (orderRefund) => orderRefund.order)
  orderRefund: OrderRefund;

  @ManyToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.order,
  )
  promotionHistory: PromotionHistory;

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
