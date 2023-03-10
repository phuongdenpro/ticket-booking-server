import { GenderEnum } from './../../enums/gender.enum';
import { Entity, OneToMany, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entities';
import { Ward } from './vi-address-ward.entities';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomerGroupDetail } from './customer-group-detail.entities';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password', type: 'varchar', default: null, nullable: false })
  password?: string;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({
    name: 'status',
    type: 'int',
    default: 0,
    nullable: false,
  })
  status?: number;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email?: string;

  @Column({ name: 'fullname', type: 'varchar', nullable: false })
  fullName?: string;

  @Column({ name: 'gender', type: 'varchar', default: 'N', nullable: false })
  gender?: GenderEnum;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address?: string;

  @Column({ name: 'full_address', type: 'varchar', nullable: true })
  fullAddress?: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'birthday', type: 'timestamp', nullable: true })
  birthday?: Date;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  accessToken?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
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

  // Relationships
  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(
    () => CustomerGroupDetail,
    (customerGroupDetail) => customerGroupDetail.customer,
  )
  customerGroupDetail?: CustomerGroupDetail[];

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];
}
