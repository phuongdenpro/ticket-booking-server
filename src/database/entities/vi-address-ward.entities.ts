import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { District, Station, Staff, Customer } from './';

@Entity({ name: 'vi_address_ward' })
export class Ward {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({
    name: 'codename',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  codename: string;

  @Column({ name: 'code', type: 'int', nullable: true, unique: true })
  code: number;

  @Column({ name: 'district_code', type: 'int', nullable: true })
  districtCode: number;

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

  // Relationships
  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'parent_code_id', referencedColumnName: 'id' })
  district: District;

  @OneToMany(() => Customer, (customer) => customer.ward)
  customers?: Customer[];

  @OneToMany(() => Staff, (staff) => staff.ward)
  staffs?: Staff[];

  @OneToMany(() => Station, (station) => station.ward)
  stations?: Station[];
}
