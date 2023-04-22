import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { CronjobController } from './cronjob.controller';

@Module({
  providers: [CronjobService],
  controllers: [CronjobController],
})
export class CronjobModule {}
