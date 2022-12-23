import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserCredential } from './user-credential.entity';
import { RoleEnum } from 'src/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar' })
  public username: string;

  @Column({ name: 'name', type: 'varchar' })
  public name: string;

  @Column({ name: 'birthDate', type: 'date', nullable: true })
  public birthDate: Date;

  @Column({ name: 'phone', type: 'varchar' })
  public phone: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  public email: string;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  public avatar: string;

  @Column({ name: 'gender', type: 'smallint', default: 0 })
  public gender: number;

  @Column({ name: 'status', type: 'smallint', default: 0 })
  public status: number;

  @Column({ name: 'isLock', type: 'bool', default: false, select: false })
  public isLock: boolean;

  @Column({ name: 'isDeleted', type: 'bool', default: false, select: false })
  public isDeleted: boolean;

  // Relationships
  @OneToOne(() => UserCredential, (userCredential) => userCredential.user, {
    cascade: true,
  })
  userCredential: UserCredential;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ name: 'updatedBy', type: 'uuid', nullable: true, select: false })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public updatedAt?: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: number;
}
