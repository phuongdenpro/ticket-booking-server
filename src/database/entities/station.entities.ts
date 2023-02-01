import { Trip } from './trip.entities';
import { Ward } from './vi-address-ward.entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'station' })
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_deleted', type: 'tinyint', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
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
  @ManyToOne(() => Ward, (ward) => ward.stations)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(() => Trip, (trip) => trip.fromStation)
  fromTrips?: Trip[];

  @OneToMany(() => Trip, (trip) => trip.toStation)
  toTrips?: Trip[];
}
