import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Station } from './station.entities';
import { TripDetail } from './trip-detail.entities';

@Entity({ name: 'trip' })
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @ManyToOne(() => Station, (station) => station.fromTrips)
  @JoinColumn({ name: 'from_station_id', referencedColumnName: 'id' })
  fromStation: Station;

  @ManyToOne(() => Station, (station) => station.toTrips)
  @JoinColumn({ name: 'to_station_id', referencedColumnName: 'id' })
  toStation: Station;

  @OneToMany(() => TripDetail, (tripDetail) => tripDetail.trip)
  tripDetails: TripDetail[];

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
