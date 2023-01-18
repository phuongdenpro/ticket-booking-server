import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AuthService } from './auth.service';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { AuthUserModule } from './user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([]),
    AdminModule,
    AuthUserModule,
    HttpModule,
  ],
  controllers: [],
  providers: [AuthService, AtStrategy, RtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
