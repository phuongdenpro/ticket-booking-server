import { GenderEnum } from './../../enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order, OrderRefund, Ward, PaymentHistory } from '.';

@Entity({ name: 'staff' })
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password', type: 'varchar', default: null, nullable: true })
  password?: string;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    default: null,
  })
  lastLogin?: Date = null;

  @Column({ name: 'is_active', type: 'bool', default: false })
  isActive?: boolean;

  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 100,
  })
  code: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar' })
  email?: string;

  @Column({ name: 'fullname', type: 'varchar', nullable: false })
  fullName?: string;

  @Column({ name: 'gender', type: 'varchar', length: 1, default: 'N' })
  gender?: GenderEnum;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 255,
    default: '',
    nullable: true,
  })
  address?: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @Column({
    name: 'birthday',
    type: 'date',
    default: null,
    nullable: true,
  })
  birthDay?: Date;

  @Column({ name: 'is_manage', type: 'bool', default: false, select: false })
  isManage?: boolean;

  @Column({ name: 'full_address', type: 'varchar', nullable: true })
  fullAddress?: string;

  @Column({ name: 'is_first_login', type: 'bool', default: false, select: false })
  isFirstLogin?: boolean;
  
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  refreshToken?: string;

  @Column({
    name: 'access_token',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  accessToken?: string;

  @Column({ name: 'otp_code', type: 'varchar', length: 10, nullable: true })
  otpCode: string;

  @Column({ name: 'otp_expired', type: 'timestamp', nullable: true })
  otpExpired: Date;

  @Column({ name: 'note_status', type: 'text', nullable: true })
  noteStatus: string;

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

  // Relationships
  @ManyToOne(() => Ward, (ward) => ward.staffs)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(() => Order, (order) => order.staff)
  orders?: Order[];

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.staff)
  paymentHistories?: Order[];

  @OneToMany(() => OrderRefund, (order) => order.customer)
  orderRefunds?: OrderRefund[];
}
