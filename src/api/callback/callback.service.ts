import { Order } from './../../database/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CallbackService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async callbackZaloPayV2(dto) {
    const config = {
      key2: this.configService.get('ZALO_PAY_KEY_2'),
    };
    const result = {};
    try {
      const { data: dataStr, mac: reqMac } = dto;

      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result['return_code'] = -1;
        result['return_message'] = 'mac not equal';
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        const dataJson = JSON.parse(dataStr, config.key2);
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson['app_trans_id'],
        );
        console.log('dataJson =', dataJson);

        result['return_code'] = 1;
        result['return_message'] = 'success';
      }
    } catch (ex) {
      result['return_code'] = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result['return_message'] = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    return result;
  }
}
