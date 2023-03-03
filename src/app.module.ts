import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ExceptionHandlerInterceptor,
  TransformResponseInterceptor,
} from './utils/interceptors';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './api/customer/customer.module';
import { ProvinceModule } from './api/address/province/province.module';
import { DistrictModule } from './api/address/district/district.module';
import { WardModule } from './api/address/ward/ward.module';
import { StationModule } from './api/station/station.module';
import { VehicleModule } from './api/vehicle/vehicle.module';
import { SeatModule } from './api/seat/seat.module';
import { ImageResourceModule } from './api/image-resource/image-resource.module';
import { UploadModule } from './api/upload/upload.module';
import { TripModule } from './api/trip/trip.module';
import { TripDetailModule } from './api/trip-detail/trip-detail.module';
import { CustomerGroupModule } from './api/customer-group/customer-group.module';
import { TicketGroupModule } from './api/ticket-group/ticket-group.module';
import { PriceListModule } from './api/price-list/price-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    CustomerModule,
    CustomerGroupModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    StationModule,
    TripModule,
    TripDetailModule,
    VehicleModule,
    SeatModule,
    TicketGroupModule,
    ImageResourceModule,
    PriceListModule,
    UploadModule,
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
