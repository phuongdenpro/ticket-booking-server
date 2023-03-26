import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PriceList, OrderDetail } from '.';

@Entity({ name: 'price_detail' })
export class PriceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'price', type: 'double', nullable: false, default: 0.0 })
  price: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

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
  @ManyToOne(() => PriceList, (priceList) => priceList.priceDetails)
  @JoinColumn({ name: 'price_list_id', referencedColumnName: 'id' })
  priceList: PriceList;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.priceDetail)
  orderDetails: OrderDetail[];
}
