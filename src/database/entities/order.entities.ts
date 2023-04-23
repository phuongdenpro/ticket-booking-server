import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer, OrderDetail, OrderRefund, PromotionHistory, Staff } from '.';
import { PaymentHistory } from './payment-history.entities';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({
    name: 'order_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  orderCode: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'total', type: 'double', nullable: true, default: 0.0 })
  total: number;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ name: 'final_total', type: 'double', nullable: true, default: 0.0 })
  finalTotal: number;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  paymentMethod: string;

  @Column({
    name: 'trans_Id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  transId: string;

  @Column({
    name: 'create_app_time',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  createAppTime: string;

  @Column({
    name: 'zalo_trans_Id',
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  zaloTransId: string;

  @Column({ name: 'zalo_trans_time', type: 'timestamp', nullable: false })
  paymentTime: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  public updatedAt?: Date;

  // relationship
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;

  @ManyToOne(() => Staff, (staff) => staff.orders)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @OneToOne(() => OrderRefund, (orderRefund) => orderRefund.order)
  orderRefund: OrderRefund;

  @OneToMany(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.order,
  )
  promotionHistories: PromotionHistory[];

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.order)
  paymentHistories: PaymentHistory[];
}
