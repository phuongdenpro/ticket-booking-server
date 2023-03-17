import { TicketGroupService } from './../ticket-group/ticket-group.service';
import { PriceListService } from './../price-list/price-list.service';
import { PriceList } from './../../database/entities/price-list.entities';
import { SeatService } from './../seat/seat.service';
import { AdminService } from './../admin/admin.service';
import { CustomerService } from './../customer/customer.service';
import {
  Order,
  OrderDetail,
  Staff,
  Customer,
  Seat,
  Ticket,
  TicketDetail,
  TicketGroup,
  TripDetail,
  PriceDetail,
} from './../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TicketService } from '../ticket/ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      Staff,
      Customer,
      Seat,
      Ticket,
      TicketDetail,
      TripDetail,
      TicketGroup,
      PriceList,
      PriceDetail,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    CustomerService,
    AdminService,
    SeatService,
    TicketService,
    TicketGroupService,
    PriceListService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
