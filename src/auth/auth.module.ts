import { AuthCustomerModule } from './customer/auth-customer.module';
import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAdminModule } from './admin/auth-admin.module';
import { AuthService } from './auth.service';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([]),
    AuthAdminModule,
    AuthCustomerModule,
    HttpModule,
  ],
  controllers: [],
  providers: [AuthService, AtStrategy, RtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
