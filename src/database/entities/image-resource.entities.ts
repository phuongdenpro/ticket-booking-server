import { Station, Vehicle } from './../../database/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'image_resource' })
export class ImageResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url', type: 'text', nullable: false })
  url: string;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
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
  })
  deletedAt?: Date;

  // relationship
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.images)
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle;

  @ManyToOne(() => Station, (station) => station.images)
  @JoinColumn({ name: 'station_id', referencedColumnName: 'id' })
  station: Station;
}
