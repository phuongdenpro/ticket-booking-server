import { CustomerGroup } from './customer-group.entities';
import { PromotionLine } from './promotion-line.entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApplicableCustomerGroup } from './applicable-customer-group.entities';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotion' })
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image', type: 'text', nullable: true })
  image: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'status', type: 'smallint', nullable: true, default: 0 })
  status: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @OneToMany(() => PromotionLine, (promotionLine) => promotionLine.promotion)
  promotionLine: PromotionLine;

  @ManyToMany(
    () => ApplicableCustomerGroup,
    (applicableCustomerGroup) =>
      applicableCustomerGroup.applicableCustomerGroups,
  )
  applicableCustomerGroups: ApplicableCustomerGroup[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;
}
