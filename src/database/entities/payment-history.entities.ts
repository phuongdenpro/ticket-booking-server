import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entities';

@Entity({ name: 'payment_history' })
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'amount', type: 'double', nullable: true, default: 0.0 })
  amount: number;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({
    name: 'order_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  orderCode: string;

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

  @Column({ name: 'create_app_time', type: 'timestamp', nullable: false })
  createAppTime: Date;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  public updatedAt?: Date;

  // relations
  @ManyToOne(() => Order, (order) => order.paymentHistories)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;
}
