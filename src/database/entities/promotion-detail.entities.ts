import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApplicableTicketGroup, Promotion, PromotionLine } from '.';

@Entity({ name: 'promotion_detail' })
export class PromotionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity_buy', type: 'int', default: 1 })
  quantityBuy: number;

  @Column({ name: 'quantity_receive', type: 'int', default: 1 })
  quantityReceive: number;

  @Column({ name: 'purchase_amount', type: 'double', default: 0 })
  purchaseAmount: number;

  @Column({ name: 'reduction_amount', type: 'double', default: 0 })
  reductionAmount: number;

  @Column({ name: 'percent_discount', type: 'double', default: 0 })
  percentDiscount: number;

  @Column({ name: 'maximum_reduction_amount', type: 'double', default: 0 })
  maxReductionAmount: number;

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
  @OneToMany(
    () => PromotionLine,
    (promotionLine) => promotionLine.promotionDetail,
  )
  @JoinColumn({ name: 'promotion_line_id', referencedColumnName: 'id' })
  promotionLine: PromotionLine[];

  @ManyToOne(() => Promotion, (promotionLine) => promotionLine.promotionDetail)
  @JoinColumn({ name: 'promotion_id', referencedColumnName: 'id' })
  promotion: Promotion;

  @OneToMany(
    () => ApplicableTicketGroup,
    (applicableTicketGroup) => applicableTicketGroup.promotionDetail,
  )
  applicableTicketGroup: ApplicableTicketGroup[];
}
