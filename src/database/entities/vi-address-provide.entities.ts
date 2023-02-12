import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './vi-address-district.entities';

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
    nullable: true,
  })
  codename: string;

  @Column({ name: 'id_deleted', type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @OneToMany(() => District, (district) => district.parentCode)
  districts: District[];
}