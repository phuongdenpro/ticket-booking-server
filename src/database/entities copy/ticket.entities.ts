import { OrderRefundDetail } from './order-refund-detail.entities';
import { TicketGroup } from './ticket-group.entities';
import { PromotionDetail } from './promotion-detail.entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { PriceDetail } from './price-detail.entities';
import { TicketDetail } from './ticket-detail.entities';
import { OrderDetail } from './order-detail.entities';
import { TicketGroupDetail } from './ticket-group-detail.entities';
import { ApplicableTicket } from './applicable-ticket.entities';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'ticket' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'image', type: 'text' })
  image: string;

  @Column({ name: 'status', type: 'tinyint', default: 0 })
  status: boolean;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @ManyToMany(
    () => ApplicableTicket,
    (applicableTicket) => applicableTicket.ticket,
  )
  applicableTicket: ApplicableTicket[];

  @ManyToMany(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.tickets,
  )
  promotionDetails: PromotionDetail[];

  @ManyToOne(
    () => TicketGroupDetail,
    (ticketGroupDetail) => ticketGroupDetail.ticket,
  )
  ticketGroupDetail: TicketGroupDetail;

  @OneToOne(() => TicketDetail, (ticketDetail) => ticketDetail.ticket)
  ticketDetail: TicketDetail;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.ticket)
  orderDetail: OrderDetail;

  @ManyToOne(
    () => OrderRefundDetail,
    (orderRefundDetail) => orderRefundDetail.ticket,
  )
  orderRefundDetail: OrderRefundDetail;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy:string;
  
  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy:string;

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
