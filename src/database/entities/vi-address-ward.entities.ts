import { Staff } from './staff.entities';
import { Customer } from './customer.entities';
import { PassengerCarCompany } from './passenger-car-company.entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { District } from './vi-address-district.entities';
import { Station } from './station.entities';

@Entity({ name: 'vi_address_ward' })
export class Ward {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({
    name: 'name_with_type',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nameWithType: string;

  @Column({ name: 'code', type: 'int', nullable: true, unique: true })
  code: number;

  @Column({ name: 'district_code', type: 'int', nullable: true })
  districtCode: number;

  @Column({ name: 'id_deleted', type: 'tinyint', default: 0 })
  isDeleted: boolean;

  // Relationships
  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'parent_code_id', referencedColumnName: 'id' })
  parentCode: string;

  @OneToMany(() => Customer, (customer) => customer.ward)
  customers?: Customer[];

  @OneToMany(() => Staff, (staff) => staff.ward)
  staffs?: Staff[];

  @OneToMany(
    () => PassengerCarCompany,
    (passengerCarCompany) => passengerCarCompany.ward,
  )
  passengerCarCompanies: PassengerCarCompany[];

  @OneToMany(() => Station, (station) => station.ward)
  stations?: Station[];
}
