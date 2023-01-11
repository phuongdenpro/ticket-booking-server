import { GenderEnum } from './../../enums/gender.enum';
import {
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerGroup } from './customer-group.entities';
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

  @Column({ name: 'password', type: 'varchar', default: null, nullable: true })
  password?: string;

  @Column({ name: 'last_login', type: 'timestamp' })
  lastLogin?: Date;

  @Column({ name: 'is_active', type: 'bool', default: false, select: false })
  isActive?: boolean;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email?: string;

  @Column({ name: 'fullname', type: 'varchar', nullable: true })
  fullName?: string;

  @Column({ name: 'gender', type: 'varchar', default: 'N' })
  gender?: GenderEnum = GenderEnum.NONE;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address?: string;

  @Column({ name: 'note', type: 'text' })
  note?: string;

  @Column({ name: 'birthday', type: 'timestamp', nullable: true })
  birthDay?: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy:string;
  
  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy:string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  accessToken?: string;

  // Relationships
  // Relationships
  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @ManyToMany(
    () => CustomerGroupDetail,
    (customerGroupDetail) => customerGroupDetail.customers,
  )
  customerGroupDetail?: CustomerGroupDetail[];

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

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
