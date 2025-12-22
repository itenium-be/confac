import {Customer} from './customer';
import {OrderLine} from './order-line';
import {OrderType} from './order-type';
import {OrderDirection} from './order-direction';

export interface CreateOrderRequest {
  OrderType: OrderType;
  OrderDirection: OrderDirection;
  OrderNumber?: string;
  OrderDate: string; // YYYY-MM-DD format
  ExpiryDate: string; // YYYY-MM-DD format
  Reference?: string;
  OrderTitle?: string;
  Currency?: string;
  PaymentReference?: string;
  Customer: Customer;
  OrderLines: OrderLine[];
}
