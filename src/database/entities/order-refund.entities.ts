import {
  OrderRefundDetail,
  Order,
  PromotionHistory,
  Customer,
  Staff,
  PaymentHistory,
} from '.';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'order_refund' })
export class OrderRefund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 200, nullable: false })
  code: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({
    name: 'total',
    type: 'double',
    nullable: true,
    default: 0.0,
    unsigned: true,
  })
  total: number;

  @Column({ name: 'order_code', type: 'varchar', length: 100, nullable: false })
  orderCode: string;

  @Column({
    name: 'customer_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  customerCode: string;

  @Column({
    name: 'staff_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  staffCode: string;

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
  @OneToOne(() => Order, (order) => order.orderRefund)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @OneToMany(
    () => OrderRefundDetail,
    (orderRefundDetail) => orderRefundDetail.orderRefund,
  )
  orderRefundDetails: OrderRefundDetail[];

  @OneToMany(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.orderRefund,
  )
  promotionHistories: PromotionHistory[];

  @ManyToOne(() => Customer, (customer) => customer.orderRefunds)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;

  @ManyToOne(() => Staff, (staff) => staff.orderRefunds)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;

  @OneToOne(() => PaymentHistory, (paymentHistory) => paymentHistory.order)
  paymentHistory: PaymentHistory;
}
