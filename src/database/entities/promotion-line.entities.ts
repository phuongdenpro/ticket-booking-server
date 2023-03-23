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
} from 'typeorm';
import { PromotionHistory, PromotionDetail, Promotion } from '.';

@Entity({ name: 'promotion_line' })
export class PromotionLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'title', type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({
    name: 'promotion_code',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  promotionCode: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'type', type: 'varchar', length: 200, nullable: true })
  type: PromotionTypeEnum;

  @Column({ name: 'max_quantity', type: 'int', nullable: false, default: 1 })
  max_quantity: number;

  @Column({
    name: 'max_quantity_per_customer',
    type: 'int',
    nullable: false,
    default: 1,
  })
  max_quantity_per_customer: number;

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
  // @JoinColumn({ name: 'promotion_detail_id', referencedColumnName: 'id' })
  promotionDetail: PromotionDetail;

  @ManyToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.promotionLine,
  )
  @JoinColumn({ name: 'promotion_history_id', referencedColumnName: 'id' })
  promotionHistory: PromotionHistory;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionLines)
  @JoinColumn({ name: 'promotion_id', referencedColumnName: 'id' })
  promotion: Promotion;
}
