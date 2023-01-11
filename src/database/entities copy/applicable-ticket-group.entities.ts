import { CustomerGroup } from './customer-group.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Customer } from './customer.entities';
import { Promotion } from './promotion.entities';
import { PromotionDetail } from './promotion-detail.entities';
import { TicketGroup } from './ticket-group.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'applicable_ticket_group' })
export class ApplicableTicketGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.applicableTicket,
  )
  @JoinColumn([{ name: 'promotion_detail_id', referencedColumnName: 'id' }])
  promotionDetail: Promotion;

  @ManyToOne(
    () => TicketGroup,
    (ticketGroup) => ticketGroup.applicableTicketGroups,
  )
  @JoinColumn([{ name: 'ticket_group_id', referencedColumnName: 'id' }])
  ticketGroup: TicketGroup;

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
