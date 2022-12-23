import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity({ name: 'user_credential' })
export class UserCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refresh_token: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  access_token: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @OneToOne(() => User, (user) => user.userCredential, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ name: 'updatedBy', type: 'uuid', nullable: true, select: false })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true, select: false })
  public updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true, select: false })
  public deletedAt?: Date;
}
