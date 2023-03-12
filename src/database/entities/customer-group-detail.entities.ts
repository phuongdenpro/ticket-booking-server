import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomerGroup, Customer } from '.';

@Entity({ name: 'customer_group_detail' })
export class CustomerGroupDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  // relationship
  @ManyToOne(() => Customer, (customer) => customer.customerGroupDetail)
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(
    () => CustomerGroup,
    (customerGroup) => customerGroup.customerGroupDetail,
  )
  @JoinColumn([{ name: 'customer_group_id', referencedColumnName: 'id' }])
  customerGroup: CustomerGroup;
}
