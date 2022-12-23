import { AdminUser,  User, UserCredential } from 'src/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserCredential, AdminUser]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
