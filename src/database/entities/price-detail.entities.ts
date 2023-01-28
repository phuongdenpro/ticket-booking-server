import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PriceList } from './price-list.entities';
import { OrderDetail } from './order-detail.entities';
import { TicketGroup } from './ticket-group.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'price_detail' })
export class PriceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'price', type: 'double', nullable: true, default: 0.0 })
  price: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @ManyToOne(() => PriceList, (priceList) => priceList.priceDetails)
  @JoinColumn({ name: 'price_list_id', referencedColumnName: 'id' })
  priceList: PriceList;

  @ManyToOne(() => TicketGroup, (ticketGroup) => ticketGroup.priceDetail)
  @JoinColumn({ name: 'ticket_group_id', referencedColumnName: 'id' })
  ticketGroup: TicketGroup;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.priceDetail)
  orderDetails: OrderDetail[];

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
