import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column({ name: 'type', type: 'varchar', length: 100, nullable: true })
  type: string;

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
  @ManyToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.promotionLine,
  )
  @JoinColumn({ name: 'promotion_detail_id', referencedColumnName: 'id' })
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
