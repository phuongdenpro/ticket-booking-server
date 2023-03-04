import { PromotionDetail, ApplicableCustomerGroup } from '.';
import {
  Column,
  Entity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotion' })
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'budget', type: 'double', nullable: true })
  budget: number;

  @Column({ name: 'type', type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ name: 'image', type: 'text', nullable: true })
  image: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'max_quantity', type: 'int', nullable: true, default: 1 })
  maxQuantity: number;

  @Column({
    name: 'max_quantity_per_customer',
    type: 'int',
    nullable: true,
    default: 1,
  })
  maxQuantityPerCustomer: number;

  @Column({
    name: 'max_quantity_per_customer_per_day',
    type: 'int',
    nullable: true,
    default: 1,
  })
  maxQuantityPerCustomerPerDay: number;

  @Column({ name: 'status', type: 'varchar', nullable: true })
  status: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

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

  // relationships
  @ManyToMany(
    () => ApplicableCustomerGroup,
    (applicableCustomerGroup) =>
      applicableCustomerGroup.applicableCustomerGroups,
  )
  applicableCustomerGroups: ApplicableCustomerGroup[];

  @OneToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.promotion,
  )
  promotionDetail: PromotionDetail;
}
