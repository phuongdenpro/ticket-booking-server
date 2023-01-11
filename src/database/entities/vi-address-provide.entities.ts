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

  @Column({ name: 'code', type: 'int', nullable: true })
  code: number;

  @Column({
    name: 'name_with_type',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nameWithType: string;

  @OneToMany(() => District, (district) => district.parentCode)
  districts: District[];
}
