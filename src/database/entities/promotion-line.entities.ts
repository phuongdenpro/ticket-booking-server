import { PromotionDetail } from './promotion-detail.entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promotion } from './promotion.entities';
import { PromotionHistory } from './promotion-history.entities';

@Entity({ name: 'promotion_line' })
export class PromotionLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'promotion_code',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  promotionCode: string;

  @Column({ name: 'type', type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({
    name: 'status',
    type: 'bool',
    nullable: true,
    default: false,
  })
  status: boolean;

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

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionLine)
  @JoinColumn({ name: 'promotion_id', referencedColumnName: 'id' })
  promotion: Promotion;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @OneToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.promotionLine,
  )
  promotionDetail: PromotionDetail;

  @ManyToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.promotionLine,
  )
  promotionHistory: PromotionHistory;

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
