import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CallbackService } from './callback.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('callback')
@ApiTags('Callback')
export class CallbackController {
  constructor(private callbackService: CallbackService) {}

  @Post('zalopay')
  @HttpCode(HttpStatus.OK)
  async callbackZaloPayV2(@Body() dto) {
    return await this.callbackService.callbackZaloPayV2(dto);
  }
}
