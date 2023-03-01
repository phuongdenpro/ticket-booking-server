import { ImageResource } from './image-resource.entities';
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
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'station' })
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ name: 'full_address', type: 'text' })
  fullAddress: string;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  deletedAt?: Date;

  // relationship
  @ManyToOne(() => Ward, (ward) => ward.stations)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(() => Trip, (trip) => trip.fromStation)
  fromTrips?: Trip[];

  @OneToMany(() => Trip, (trip) => trip.toStation)
  toTrips?: Trip[];

  @OneToMany(() => ImageResource, (imageResource) => imageResource.station)
  images?: ImageResource[];
}
