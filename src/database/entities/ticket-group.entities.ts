import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApplicableTicketGroup, PriceDetail, TicketGroupDetail } from '.';

@Entity({ name: 'ticket_group' })
export class TicketGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

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

  // relations
  @OneToMany(
    () => ApplicableTicketGroup,
    (applicableTicketGroup) => applicableTicketGroup.ticketGroup,
  )
  applicableTicketGroups: ApplicableTicketGroup[];

  @OneToMany(
    () => TicketGroupDetail,
    (ticketGroupDetail) => ticketGroupDetail.ticketGroup,
  )
  ticketGroupDetail: TicketGroupDetail[];

  @OneToMany(() => PriceDetail, (priceDetail) => priceDetail.ticketGroup)
  priceDetail: PriceDetail[];
}
