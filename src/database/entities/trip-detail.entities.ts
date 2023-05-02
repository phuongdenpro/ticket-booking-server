import { Vehicle, Trip, Province, Ticket, OrderRefundDetail } from '.';
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

@Entity({ name: 'trip_detail' })
export class TripDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'departure_time', type: 'timestamp', nullable: false })
  departureTime: Date;

  @Column({ name: 'expected_time', type: 'timestamp', nullable: false })
  expectedTime: Date;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
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
  deletedAt?: Date;

  // relationships
  @ManyToOne(() => Trip, (trip) => trip.tripDetails)
  @JoinColumn({ name: 'trip_id', referencedColumnName: 'id' })
  trip: Trip;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.tripDetails)
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle;

  @ManyToOne(() => Province, (province) => province.fromTripDetails)
  @JoinColumn({ name: 'from_province_id', referencedColumnName: 'id' })
  fromProvince: Province;

  @ManyToOne(() => Province, (province) => province.toTripDetails)
  @JoinColumn({ name: 'to_province_id', referencedColumnName: 'id' })
  toProvince: Province;

  @OneToMany(() => Ticket, (ticket) => ticket.tripDetail)
  tickets: Ticket[];

  // @ManyToOne(
  //   () => OrderRefundDetail,
  //   (orderRefundDetail) => orderRefundDetail.ticketDetail,
  // )
  // @JoinColumn({ name: 'order_refund_detail_id', referencedColumnName: 'id' })
  // orderRefundDetail: OrderRefundDetail;
}
