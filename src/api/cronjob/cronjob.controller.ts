import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CronjobService } from './cronjob.service';
import { CronjobOrderPaymentDto } from './dto';

@Controller('cronjob')
@ApiTags('Cronjob')
export class CronjobController {
  constructor(private cronjobService: CronjobService) {}

  @Post('/order-payment')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() dto: CronjobOrderPaymentDto) {
    return await this.cronjobService.cronjobOrderPayment(dto);
  }
}
