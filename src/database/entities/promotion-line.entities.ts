import { PromotionTypeEnum } from './../../enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PromotionHistory, PromotionDetail, Promotion } from '.';

@Entity({ name: 'promotion_line' })
export class PromotionLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({
    name: 'coupon_code',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  couponCode: string;

  @Column({ name: 'title', type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: false })
  endDate: Date;

  @Column({ name: 'type', type: 'varchar', length: 200, nullable: false })
  type: PromotionTypeEnum;

  @Column({
    name: 'use_budget',
    type: 'double',
    nullable: false,
    default: 0,
    unsigned: true,
  })
  useBudget: number;

  @Column({
    name: 'max_budget',
    type: 'double',
    nullable: false,
    default: 1,
    unsigned: true,
  })
  maxBudget: number;

  @Column({
    name: 'use_quantity',
    type: 'double',
    nullable: false,
    default: 0,
    unsigned: true,
  })
  useQuantity: number;

  @Column({
    name: 'max_quantity',
    type: 'int',
    nullable: false,
    default: 1,
    unsigned: true,
  })
  maxQuantity: number;

  @Column({
    name: 'apply_all',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  applyAll: boolean;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
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
  @OneToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.promotionLine,
  )
  promotionDetail: PromotionDetail;

  @OneToMany(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.promotionLine,
  )
  promotionHistory: PromotionHistory[];

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionLines)
  @JoinColumn({ name: 'promotion_id', referencedColumnName: 'id' })
  promotion: Promotion;
}
