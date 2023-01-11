import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entities';
import { Ward } from './ward.entities';

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

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'parent_code_id', referencedColumnName: 'id' })
  parentCode: number;

  @OneToMany(() => Ward, (ward) => ward.parentCode)
  wards: Ward[];
}
