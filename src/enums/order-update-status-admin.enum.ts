import { OrderStatusEnum } from './order-status.enum';
import { OrderUpdateStatusCustomerEnum } from './order-update-status-customer.enum';

export enum OrderUpdateStatusAdminEnum {
  UNPAID = OrderStatusEnum.UNPAID,
  CANCEL = OrderUpdateStatusCustomerEnum.CANCEL,
  PAID = OrderStatusEnum.PAID,
  RETURNED = OrderUpdateStatusCustomerEnum.RETURNED,
}
