import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Entity,
} from 'typeorm';
import { Trip, PriceDetail } from '.';

@Entity({ name: 'applicable_price_detail' })
export class ApplicablePriceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @ManyToOne(() => Trip, (trip) => trip.applicablePriceDetails)
  @JoinColumn({ name: 'trip_id', referencedColumnName: 'id' })
  trip: Trip;

  @ManyToOne(
    () => PriceDetail,
    (priceDetail) => priceDetail.applicablePriceDetails,
  )
  @JoinColumn({ name: 'price_detail_id', referencedColumnName: 'id' })
  priceDetail: PriceDetail;
}
