import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Station } from './station.entities';
import { TripDetail } from './trip-detail.entities';
import { ApplicablePriceDetail } from '.';

@Entity({ name: 'trip' })
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', type: 'tinyint', default: true })
  isActive: boolean;

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
  deletedAt?: Date;

  // relationship
  @ManyToOne(() => Station, (station) => station.fromTrips)
  @JoinColumn({ name: 'from_station_id', referencedColumnName: 'id' })
  fromStation: Station;

  @ManyToOne(() => Station, (station) => station.toTrips)
  @JoinColumn({ name: 'to_station_id', referencedColumnName: 'id' })
  toStation: Station;

  @OneToMany(() => TripDetail, (tripDetail) => tripDetail.trip)
  tripDetails: TripDetail[];

  @OneToMany(
    () => ApplicablePriceDetail,
    (applicablePriceDetail) => applicablePriceDetail.trip,
  )
  applicablePriceDetails: ApplicablePriceDetail[];
}
