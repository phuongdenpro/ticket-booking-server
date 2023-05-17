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
import { PriceListModule } from './api/price-list/price-list.module';
import { AdminModule } from './api/admin/admin.module';
import { UserModule } from './api/user/user.module';
import { PromotionModule } from './api/promotion/promotion.module';
import { BookingModule } from './api/booking/booking.module';
import { TicketModule } from './api/ticket/ticket.module';
import { OrderModule } from './api/order/order.module';
import { PromotionLineModule } from './api/promotion-line/promotion-line.module';
import { PromotionHistoryModule } from './api/promotion-history/promotion-history.module';
import { StatisticsModule } from './api/statistics/statistics.module';
import { CallbackModule } from './api/callback/callback.module';
import { CronjobModule } from './api/cronjob/cronjob.module';
import { PaymentModule } from './api/payment/payment.module';
import { PaymentHistoryModule } from './api/payment-history/payment-history.module';
import { OrderRefundModule } from './api/order-refund/order-refund.module';
import { StaffModule } from './api/staff/staff.module';
import { SiteModule } from './api/site/site.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    AdminModule,
    StaffModule,
    UserModule,
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
    TicketModule,
    ImageResourceModule,
    PriceListModule,
    PromotionModule,
    PromotionLineModule,
    PromotionHistoryModule,
    BookingModule,
    OrderModule,
    OrderRefundModule,
    PaymentModule,
    PaymentHistoryModule,
    StatisticsModule,
    CallbackModule,
    CronjobModule,
    UploadModule,
    SiteModule,
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
