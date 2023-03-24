import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PromotionDetail, TicketGroup } from '.';

@Entity({ name: 'applicable_ticket_group' })
export class ApplicableTicketGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.applicableTicketGroup,
  )
  @JoinColumn([{ name: 'promotion_detail_id', referencedColumnName: 'id' }])
  promotionDetail: PromotionDetail;

  @ManyToOne(
    () => TicketGroup,
    (ticketGroup) => ticketGroup.applicableTicketGroups,
  )
  @JoinColumn([{ name: 'ticket_group_id', referencedColumnName: 'id' }])
  ticketGroup: TicketGroup;

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
}
