import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PromotionDetail } from './promotion-detail.entities';
import { Ticket } from './ticket.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'applicable_ticket' })
export class ApplicableTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => PromotionDetail,
    (promotionDetail) => promotionDetail.applicableTicket,
  )
  @JoinColumn([{ name: 'promotion_detail_id', referencedColumnName: 'id' }])
  promotionDetail: PromotionDetail;

  @ManyToOne(() => Ticket, (ticket) => ticket.applicableTicket)
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

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
