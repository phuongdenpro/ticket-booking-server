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
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'trip_detail' })
export class TripDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'departure_time', type: 'timestamp', nullable: false })
  departureTime: Date;

  @Column({ name: 'expected_time', type: 'timestamp', nullable: false })
  expectedTime: Date;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ name: 'is_active', type: 'tinyint', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public updatedAt?: Date;

  // relationships
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
