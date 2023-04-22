import { Module } from '@nestjs/common';
import { CallbackService } from './callback.service';
import { CallbackController } from './callback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [CallbackService],
  controllers: [CallbackController],
  exports: [CallbackService],
})
export class CallbackModule {}
