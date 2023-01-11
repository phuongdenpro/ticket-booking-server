import { TicketGroup } from './ticket-group.entities';
import { Ticket } from './ticket.entities';
import {
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApplicableTicket } from './applicable-ticket.entities';
import { ApplicableTicketGroup } from './applicable-ticket-group.entities';
import { PromotionLine } from './promotion-line.entities';

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

  @OneToOne(
    () => PromotionLine,
    (promotionLine) => promotionLine.promotionDetail,
  )
  promotionLine: PromotionLine;

  @ManyToMany(
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
