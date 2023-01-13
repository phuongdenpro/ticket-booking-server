import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './vi-address-provide.entities';
import { Ward } from './vi-address-ward.entities';

@Entity({ name: 'vi_address_district' })
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ name: 'code', type: 'int', nullable: true })
  code: number;

  @Column({ name: 'province_code', type: 'int', nullable: true })
  provinceCode: number;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'parent_code_id', referencedColumnName: 'id' })
  parentCode: string;

  @OneToMany(() => Ward, (ward) => ward.parentCode)
  wards: Ward[];
}
