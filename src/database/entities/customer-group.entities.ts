import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from './customer.entities';
import { Promotion } from './promotion.entities';
import { CustomerGroupDetail } from './customer-group-detail.entities';
import { ApplicableCustomerGroup } from './applicable-customer-group.entities';

@Entity({ name: 'customer_group' })
export class CustomerGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy:string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy:string;

  // Relations
  @ManyToMany(
    () => CustomerGroupDetail,
    (customerGroupDetail) => customerGroupDetail.customerGroups,
  )
  customerGroupDetail?: CustomerGroupDetail[];

  @ManyToMany(
    () => ApplicableCustomerGroup,
    (applicableCustomerGroup) => applicableCustomerGroup.customerGroups,
  )
  applicableCustomerGroup?: ApplicableCustomerGroup[];

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
