import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ExceptionHandlerInterceptor,
  TransformResponseInterceptor,
} from './utils/interceptors';
// import { ExceptionHandlerInterceptor, TransformResponseInterceptor } from '@utils';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './api/users/user.module';
import { ProvinceModule } from './api/address/province/province.module';
import { DistrictModule } from './api/address/district/district.module';
import { WardModule } from './api/address/ward/ward.module';
import { StationModule } from './api/station/station.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    StationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionHandlerInterceptor,
    },
  ],
})
export class AppModule {}
