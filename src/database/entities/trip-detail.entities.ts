import { Vehicle } from './vehicle.entities';
// import { PassengerCarCompany } from './passenger-car-company.entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from './trip.entities';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'trip_detail' })
export class TripDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

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

  // relations
  @ManyToOne(() => Trip, (trip) => trip.tripDetails)
  @JoinColumn({ name: 'trip_id', referencedColumnName: 'id' })
  trip: Trip;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.tripDetails)
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle;

  // @ManyToOne(
  //   () => PassengerCarCompany,
  //   (passengerCarCompany) => passengerCarCompany.tripDetails,
  // )
  // @JoinColumn({ name: 'passenger_car_id', referencedColumnName: 'id' })
  // passengerCarCompany: PassengerCarCompany;
}
