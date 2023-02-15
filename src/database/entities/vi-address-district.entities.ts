import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Province } from './vi-address-provide.entities';
import { Ward } from './vi-address-ward.entities';

@Entity({ name: 'vi_address_district' })
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 50, nullable: false })
  type: string;

  @Column({
    name: 'codename',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  codename: string;

  @Column({ name: 'code', type: 'int', nullable: false, unique: true })
  code: number;

  @Column({ name: 'province_code', type: 'int', nullable: false })
  provinceCode: number;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  public updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'parent_code_id', referencedColumnName: 'id' })
  parentCode: string;

  @OneToMany(() => Ward, (ward) => ward.parentCode)
  wards: Ward[];
}
