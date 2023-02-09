import { SeatTypeEnum } from 'src/enums';
import { TicketDetail } from './ticket-detail.entities';
import { Vehicle } from './vehicle.entities';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'seat' })
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 255, nullable: true })
  type: SeatTypeEnum;

  @Column({ name: 'floor', type: 'int', nullable: true, default: 1 })
  floor: number;

  @Column({ name: 'is_deleted', type: 'tinyint', default: false })
  isDeleted: boolean;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  public updatedAt?: Date;

  // relationship
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.seats)
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle;

  @OneToMany(() => TicketDetail, (ticketDetail) => ticketDetail.seat)
  ticketDetails: TicketDetail[];
}
