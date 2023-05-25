import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { PromotionLine, Trip } from '.';

@Entity({ name: 'promotion_detail' })
export class PromotionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'quantity_buy',
    type: 'int',
    nullable: false,
    unsigned: true,
  })
  quantityBuy: number;

  @Column({
    name: 'purchase_amount',
    type: 'double',
    nullable: true,
    unsigned: true,
  })
  purchaseAmount: number;

  @Column({
    name: 'reduction_amount',
    type: 'double',
    nullable: true,
    unsigned: true,
  })
  reductionAmount: number;

  @Column({
    name: 'percent_discount',
    type: 'double',
    nullable: true,
    unsigned: true,
  })
  percentDiscount: number;

  @Column({
    name: 'maximum_reduction_amount',
    type: 'double',
    nullable: true,
    unsigned: true,
  })
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

  @ManyToOne(() => Trip, (trip) => trip.promotionDetails)
  @JoinColumn({ name: 'trip_id', referencedColumnName: 'id' })
  trip: Trip;
}
