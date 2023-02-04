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
import { TripDetail } from '../entities/trip-detail.entities';
import { Vehicle } from '../entities/vehicle.entities';
import { Ward } from '../entities/vi-address-ward.entities';

// @Entity({ name: 'passenger_car_company' })
export class PassengerCarCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({
    name: 'code',
    type: 'int',
    unique: true,
    nullable: false,
    generated: 'increment',
  })
  code: number;

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

  // relationship
  // @ManyToOne(() => Ward, (ward) => ward.passengerCarCompanies)
  // @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  // ward: Ward;

  // @OneToMany(() => Vehicle, (vehicle) => vehicle.passengerCarCompany)
  // vehicles: Vehicle[];

  // @OneToMany(() => TripDetail, (tripDetail) => tripDetail.passengerCarCompany)
  // tripDetails: TripDetail[];
}
