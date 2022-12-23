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
import { AdminUser } from './admin-user.entity';

@Entity({ name: 'admin_user_credential' })
export class AdminUserCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password', type: 'varchar', default: null, nullable: true })
  password: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refresh_token: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  access_token: string;

  @OneToOne(() => AdminUser, (adminUser) => adminUser.adminUserCredential)
  @JoinColumn()
  adminUser: AdminUser;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true, select: false })
  public updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true, select: false })
  public deletedAt?: Date;
}
