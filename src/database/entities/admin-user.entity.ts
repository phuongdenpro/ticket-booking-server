import { AdminUserCredential } from './admin-user-credential.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'admin_user' })
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar', select: false })
  username: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'phone', type: 'varchar', select: false })
  phone: string;

  @Column({ name: 'email', type: 'varchar', select: false })
  email: string;

  @Column({ name: 'gender', type: 'smallint', select: false })
  gender: number;

  @Column({ name: 'status', type: 'smallint', default: 1, select: false })
  status: number;

  @Column({ name: 'avatar', type: 'text', nullable: true, select: false })
  avatar: string;

  @OneToOne(() => AdminUserCredential, (adminUserCredential) => adminUserCredential.adminUser)
  adminUserCredential: AdminUserCredential;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true, select: false })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true, select: false })
  public updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true, select: false })
  public deletedAt?: Date;
}
