import { Module } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistory } from './../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentHistory])],
  providers: [PaymentHistoryService],
  controllers: [PaymentHistoryController],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
