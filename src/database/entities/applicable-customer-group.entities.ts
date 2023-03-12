import { CustomerGroup, Promotion } from '.';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'applicable_customer_group' })
export class ApplicableCustomerGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.applicableCustomerGroups)
  @JoinColumn([{ name: 'promotion_id', referencedColumnName: 'id' }])
  applicableCustomerGroups: Promotion;

  @ManyToOne(
    () => CustomerGroup,
    (customerGroup) => customerGroup.customerGroupDetail,
  )
  @JoinColumn([{ name: 'customer_group_id', referencedColumnName: 'id' }])
  customerGroups: CustomerGroup;

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
