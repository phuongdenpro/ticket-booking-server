import { ActiveStatusEnum } from './../../enums';
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
import { Station, TripDetail, PromotionDetail, PriceDetail } from '.';

@Entity({ name: 'trip' })
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({
    name: 'travel_hours',
    type: 'int',
    nullable: false,
    default: 1,
    unsigned: true,
  })
  travelHours: number;

  @Column({ name: 'status', type: 'varchar', length: 100, default: false })
  status: ActiveStatusEnum;

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

  @OneToMany(() => PromotionDetail, (promotionDetail) => promotionDetail.trip)
  promotionDetails: PromotionDetail[];

  @OneToMany(() => PriceDetail, (priceDetail) => priceDetail.trip)
  priceDetails: PriceDetail[];
}
