import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentHistoryService {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async createPaymentHistory() {}
}
