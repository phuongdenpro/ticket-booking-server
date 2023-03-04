import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PromotionHistory, PromotionDetail } from '.';

@Entity({ name: 'promotion_line' })
export class PromotionLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'promotion_code',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  promotionCode: string;

  @Column({
    name: 'status',
    type: 'bool',
    nullable: true,
    default: false,
  })
  status: boolean;

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
  @ManyToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.promotionLine,
  )
  promotionDetail: PromotionDetail;

  @ManyToOne(
    () => PromotionHistory,
    (promotionHistory) => promotionHistory.promotionLine,
  )
  promotionHistory: PromotionHistory;
}
