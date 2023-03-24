import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TripDetail, District } from '.';

@Entity({ name: 'vi_address_provide' })
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ name: 'code', type: 'int', nullable: true, unique: true })
  code: number;

  @Column({
    name: 'codename',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  codename: string;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @OneToMany(() => TripDetail, (tripDetail) => tripDetail.fromProvince)
  fromTripDetails: TripDetail[];

  @OneToMany(() => TripDetail, (tripDetail) => tripDetail.toProvince)
  toTripDetails: TripDetail[];
}
