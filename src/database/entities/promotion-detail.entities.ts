import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApplicableTicketGroup, PromotionLine } from '.';

@Entity({ name: 'promotion_detail' })
export class PromotionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity_buy', type: 'int' })
  quantityBuy: number;

  @Column({ name: 'quantity_receive', type: 'int' })
  quantityReceive: number;

  @Column({ name: 'purchase_amount', type: 'double' })
  purchaseAmount: number;

  @Column({ name: 'reduction_amount', type: 'double' })
  reductionAmount: number;

  @Column({ name: 'percent_discount', type: 'double' })
  percentDiscount: number;

  @Column({ name: 'maximum_reduction_amount', type: 'double' })
  maxReductionAmount: number;

  @Column({ name: 'promotion_line_code', type: 'varchar', nullable: false })
  promotionLineCode: string;

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
    () => PromotionLine,
    (promotionLine) => promotionLine.promotionDetail,
  )
  @JoinColumn({ name: 'promotion_line_id', referencedColumnName: 'id' })
  promotionLine: PromotionLine;

  @OneToMany(
    () => ApplicableTicketGroup,
    (applicableTicketGroup) => applicableTicketGroup.promotionDetail,
  )
  applicableTicketGroup: ApplicableTicketGroup[];
}
