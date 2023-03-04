import {
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  ApplicableTicket,
  ApplicableTicketGroup,
  Promotion,
  PromotionLine,
  Ticket,
} from '.';

@Entity({ name: 'promotion_detail' })
export class PromotionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity_buy', type: 'int', default: 0 })
  quantityBuy: number;

  @Column({ name: 'quantity_receive', type: 'int', default: 0 })
  quantityReceive: number;

  @Column({ name: 'minimum_total', type: 'double', default: 0 })
  minimumTotal: number;

  @Column({ name: 'percent', type: 'double', default: 0 })
  percent: number;

  @Column({ name: 'maximum_reduction_amount', type: 'double', default: 0 })
  maximumReductionAmount: number;

  @Column({ name: 'reduction_amount', type: 'double', default: 0 })
  reductionAmount: number;

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
  @OneToMany(
    () => PromotionLine,
    (promotionLine) => promotionLine.promotionDetail,
  )
  @JoinColumn({ name: 'promotion_line_id', referencedColumnName: 'id' })
  promotionLine: PromotionLine[];

  @OneToOne(() => Promotion, (promotionLine) => promotionLine.promotionDetail)
  @JoinColumn({ name: 'promotion_id', referencedColumnName: 'id' })
  promotion: Promotion;

  @OneToMany(
    () => ApplicableTicket,
    (applicableTicket) => applicableTicket.promotionDetail,
  )
  applicableTicket?: ApplicableTicket[];

  @ManyToMany(
    () => ApplicableTicketGroup,
    (applicableTicketGroup) => applicableTicketGroup.promotionDetail,
  )
  ApplicableTicketGroup: ApplicableTicketGroup[];

  @ManyToMany(() => Ticket, (ticket) => ticket.promotionDetails)
  tickets: Ticket[];
}
